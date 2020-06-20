import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
  Platform,
  Image,
  BackHandler,
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import Colors from "../constants/Colors";
import { TextInput, Button, FAB } from "react-native-paper";
import { ControlIT } from "../models/control";
import { Ionicons } from "@expo/vector-icons";
import Strings from "../constants/Strings";
const { width, height } = Dimensions.get("window");

import * as ImagePicker from "expo-image-picker";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import { useNavigation } from "@react-navigation/native";
import Regex from "../constants/Regex";

const ASPECT_RATIO = width / height;
const LATITUDE = -15.37496;
const LONGITUDE = 28.382121;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421; //LATITUDE_DELTA * ASPECT_RATIO;

const ReportLeakageScreen = () => {
  let map: MapView;
  const navigator = useNavigation();
  const { container, mapContainer, mapStyle, flexRow } = styles;
  const [region, setRegion] = React.useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [fullName, setFullName] = React.useState<ControlIT<string>>({
    value: "",
    error: false,
  });
  const [phone, setPhone] = React.useState<ControlIT<string>>({
    value: "",
    error: false,
  });
  const [meterAccountNumber, setMeterAccountNumber] = React.useState<
    ControlIT<string>
  >({
    value: "",
    error: false,
  });
  const [image, setImage] = useState<
    (ImagePicker.ImagePickerResult & ImageInfo) | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  const requestCameraPermissionAsync = async () => {
    var { status } = await ImagePicker.requestCameraPermissionsAsync(); // Permissions.askAsync(Permissions.CAMERA);
    if (status !== "granted") {
      const { title, message } = Strings.CAMERA_PERMISSION;
      Alert.alert(title, message, [
        {
          text: "Grant Permission",
          onPress: async () =>
            await ImagePicker.requestCameraPermissionsAsync(), // Permissions.askAsync(Permissions.CAMERA)
        },
        { text: "Deny", onPress: () => BackHandler.exitApp() },
      ]);
    }
  };

  const requestCameraRollPermissionAsync = async () => {
    var { status } = await ImagePicker.requestCameraRollPermissionsAsync(); //Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      const { title, message } = Strings.CAMERA_ROLL_PERMISSION;
      Alert.alert(title, message, [
        {
          text: "Grant Permission",
          onPress: async () =>
            await ImagePicker.requestCameraRollPermissionsAsync(), // Permissions.askAsync(Permissions.CAMERA_ROLL)
        },
        { text: "Deny", onPress: () => BackHandler.exitApp() },
      ]);
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === "ios") {
      try {
        await requestCameraPermissionAsync();
        await requestCameraRollPermissionAsync();
      } catch (err) {
        const { title, message } = Strings.SELF_REPORTING_PROBLEM;
        Alert.alert(title, message, [
          { text: "Ok", onPress: () => navigator.goBack() },
        ]);
      }
    }
  };

  const captureImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
    });

    if (!result.cancelled && result.base64) {
      // console.log(result.base64);
      // setImage("data:image/jpeg;base64," + result.base64);
      // setImage(result.base64);
      setImage(result);
    }
  };

  const getLocationAsync = async () => {
    try {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        const { title, message } = Strings.LOCATION_PERMISSION;
        Alert.alert(title, message, [
          {
            text: "Grant Permission",
            onPress: async () => await getLocationAsync(),
          },
          { text: "Deny", onPress: () => BackHandler.exitApp() },
        ]);
      } else {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });
        setRegion({
          ...region,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        await requestCameraPermission();
      }
    } catch (error) {
      const { title, message } = Strings.SELF_REPORTING_PROBLEM;
      Alert.alert(title, message, [
        { text: "Ok", onPress: () => navigator.goBack() },
      ]);
    }
  };

  useEffect(() => {
    getLocationAsync();
  }, []);

  return (
    <ScrollView style={container}>
      <View style={mapContainer}>
        <MapView
          ref={(ref) => (map = ref as MapView)}
          region={region}
          zoomEnabled={true}
          showsUserLocation={true}
          onRegionChangeComplete={() => setRegion(region)}
          initialRegion={region}
          style={mapStyle}
        >
          <Marker
            draggable
            onDragEnd={(e) =>
              setRegion({
                ...region,
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
              })
            }
            coordinate={{
              longitude: region.longitude,
              latitude: region.latitude,
            }}
            pinColor={`${Colors.LwscRed}`}
          />
        </MapView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.bubble,
              { backgroundColor: `${Colors.LwscBlack}33`, borderRadius: 10 },
            ]}
          >
            <Text style={styles.bubbleText}>
              Drag marker to location of the leak
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={async () => await getLocationAsync()}
            style={styles.bubble}
          >
            <Text style={styles.bubbleText}>
              Tap to center to your location
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ paddingVertical: 15, paddingHorizontal: 15 }}>
        <View>
          {image ? (
            <View
              style={{
                position: "relative",
                borderRadius: 3,
                alignSelf: "center",
                borderWidth: 3,
                borderColor: "#00000022",
              }}
            >
              <FAB
                style={styles.fab}
                small
                icon="delete-forever"
                onPress={() => setImage(null)}
              />
              <Image
                style={{
                  width: (300 * image.width) / image.height,
                  height: 300,
                  resizeMode: "stretch",
                }}
                source={{ uri: image.uri }}
              />
            </View>
          ) : (
            <Button
              contentStyle={{
                borderColor: Colors.linkBlue,
                borderWidth: 0.75,
                borderRadius: 5,
                backgroundColor: `${Colors.linkBlue}22`,
              }}
              color={`${Colors.LwscBlue}bb`}
              //   loading={loading}
              icon={({ color }) => (
                <Ionicons
                  color={color}
                  size={22}
                  name={`${Platform.OS === "ios" ? "ios" : "md"}-camera`}
                />
              )}
              mode="outlined"
              onPress={async () => await captureImage()}
            >
              CAPTURE LEAK
            </Button>
          )}
        </View>
        <TextInput
          style={{ marginTop: 10 }}
          mode="outlined"
          label="Full Name"
          placeholder="e.g. Moses Chinthalima"
          value={fullName.value}
          error={fullName.error}
          disabled={loading}
          onChangeText={(value) => {
            setFullName({
              value,
              error: Regex.NAME.test(value),
            });
          }}
        />

        <TextInput
          style={{ marginTop: 10 }}
          mode="outlined"
          label="Phone Number"
          placeholder="e.g. +260950039290"
          value={phone.value}
          error={phone.error}
          disabled={loading}
          onChangeText={(value) => {
            setPhone({
              value,
              error: Regex.PHONE_NUMBER.test(value),
            });
          }}
        />
        <TextInput
          style={{ marginTop: 10 }}
          disabled={loading}
          mode="outlined"
          label={"Account/Meter Number (optional)"}
          value={meterAccountNumber.value}
          error={meterAccountNumber.error}
          onChangeText={(value) =>
            setMeterAccountNumber({
              value,
              error: value.length > 0 && value.length < 5,
            })
          }
        />

        <Button
          style={{ marginTop: 15 }}
          contentStyle={{
            borderColor: Colors.linkBlue,
            borderWidth: 0.75,
            borderRadius: 5,
            backgroundColor: `${Colors.linkBlue}22`,
          }}
          color={`${Colors.LwscBlue}bb`}
          loading={loading}
          //   icon="send"
          disabled={
            loading ||
            meterAccountNumber.error ||
            phone.error ||
            phone.value.length === 0 ||
            fullName.error ||
            fullName.value.length === 0
          }
          mode="outlined"
          onPress={() => {}}
        >
          Submit Report
        </Button>
      </View>
    </ScrollView>
  );
};

export default ReportLeakageScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
  },
  mapContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    height: height * 0.55,
  },
  mapStyle: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    backgroundColor: `${Colors.linkBlue}66`,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  bubbleText: {
    fontWeight: "bold",
  },
  latlng: {
    width: 200,
    alignItems: "stretch",
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
    backgroundColor: "transparent",
  },
  fab: {
    backgroundColor: "red",
    position: "absolute",
    zIndex: 999,
    margin: 16,
    right: 0,
    top: 0,
  },
});
