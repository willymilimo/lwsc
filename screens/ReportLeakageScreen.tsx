import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
  Platform,
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import Colors from "../constants/Colors";
import { TextInput, Button } from "react-native-paper";
import { ControlIT } from "../models/control";
import { Ionicons } from "@expo/vector-icons";
import Strings from "../constants/Strings";
const { width, height } = Dimensions.get("window");

import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import * as ImageManipulator from "expo-image-manipulator";

const ASPECT_RATIO = width / height;
const LATITUDE = -15.37496;
const LONGITUDE = 28.382121;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421; //LATITUDE_DELTA * ASPECT_RATIO;

const ReportLeakageScreen = () => {
  let map: MapView;
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
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  const requestCameraPermissionAsync = async () => {
    var { status } = await ImagePicker.requestCameraPermissionsAsync(); // Permissions.askAsync(Permissions.CAMERA);
    if (status !== "granted") {
      Alert.alert(
        "Camera Permission",
        "Sorry, we need camera permissions to make this work!",
        [
          {
            text: "Grant Permission",
            onPress: async () =>
              await ImagePicker.requestCameraPermissionsAsync() // Permissions.askAsync(Permissions.CAMERA)
          }
        ]
      );
    }
  };

  const requestCameraRollPermissionAsync = async () => {
    var { status } = await ImagePicker.requestCameraRollPermissionsAsync(); //Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      Alert.alert(
        "Camera Roll Permission",
        "Sorry, we need camera roll permissions to make this work!",
        [
          {
            text: "Grant Permission",
            onPress: async () =>
              await ImagePicker.requestCameraRollPermissionsAsync() // Permissions.askAsync(Permissions.CAMERA_ROLL)
          }
        ]
      );
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === "ios") {
      await requestCameraPermissionAsync();

      await requestCameraRollPermissionAsync();
    }
  };

  const captureImage = async () => {
    const granted = await requestCameraPermission();

    if (granted) {

    }
  };

  const getLocationAsync = async () => {
    try {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        const { title, message } = Strings.LOCATION_PERMISSION;
        Alert.alert(title, message);
      } else {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });
        setRegion({
          ...region,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (error) {
      // report error
    }
  };

  useEffect(() => {
    // requestCameraPermission();
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
            onPress={() => requestCameraPermission()}
          >
            CAPTURE LEAK
          </Button>
        </View>
        {/* <TouchableOpacity>
          <View
            style={[flexRow, { backgroundColor: "red", alignItems: "center" }]}
          >
            <Ionicons
              size={30}
              name={`${Platform.OS === "ios" ? "ios" : "md"}-camera`}
            />
            <Text>Capture Leakage</Text>
          </View>
        </TouchableOpacity> */}
        <TextInput
          style={{ marginTop: 10 }}
          mode="outlined"
          label="Full Name"
          placeholder="e.g. Moses Chinthalima"
          value={fullName.value}
          error={fullName.error}
          disabled={false}
          onChangeText={(text) => {}}
        />

        <TextInput
          style={{ marginTop: 10 }}
          mode="outlined"
          label="Phone Number"
          placeholder="e.g. +260950039290"
          value={phone.value}
          error={phone.error}
          disabled={false}
          onChangeText={(text) => {}}
        />
        <TextInput
          style={{ marginTop: 10 }}
          disabled={loading}
          mode="outlined"
          label={"Account/Meter Number (optional)"}
          value={meterAccountNumber.value}
          error={meterAccountNumber.error}
          onChangeText={(value) =>
            setMeterAccountNumber({ value, error: false })
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
          //   loading={loading}
          //   icon="send"
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
});
