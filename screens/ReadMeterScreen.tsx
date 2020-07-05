import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  Alert,
  BackHandler,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import { FAB, Button, TextInput } from "react-native-paper";
import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");

import Strings from "../constants/Strings";
import { InputItemType } from "../types/input-item";
import { parse } from "react-native-svg";
import { connect } from "react-redux";
import { RootReducerI } from "../redux/reducers";
import { uploadFiles } from "../models/axios";

const ASPECT_RATIO = width / height;
const LATITUDE = -15.37496;
const LONGITUDE = 28.382121;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421; //LATITUDE_DELTA * ASPECT_RATIO;

const ReadMeterScreen = ({ user }: { user: string }) => {
  const { container } = styles;
  const navigator = useNavigation();
  const [image, setImage] = useState<
    (ImagePicker.ImagePickerResult & ImageInfo) | null
  >(null);
  const [region, setRegion] = React.useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [meterNumber, setMeterNumber] = React.useState<InputItemType<string>>({
    value: "",
    error: false,
  });
  const [meterReading, setMeterReading] = useState<InputItemType<number>>({
    value: 0,
    error: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLocationAsync();
  }, []);

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
      console.log(result.uri);
      // console.log(result.base64);
      // setImage("data:image/jpeg;base64," + result.base64);
      // setImage(result.base64);
      setImage(result);
      submitImage(result.uri);
    }
  };

  const submitImage = async (uri: string) => {
    setLoading(true);
    uploadFiles([uri])
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
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

  return (
    <View style={container}>
      <>
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
      </>
      <TextInput
        style={{ marginTop: 10, backgroundColor: "white" }}
        disabled={loading}
        mode="outlined"
        label={"Meter Number"}
        value={meterNumber.value}
        error={meterNumber.error}
        onChangeText={(value) =>
          setMeterNumber({
            value,
            error: value.length > 0 && value.length < 5,
          })
        }
      />

      {user && (
        <TextInput
          style={{ marginTop: 10, backgroundColor: "white" }}
          disabled={loading}
          mode="outlined"
          label={"Meter Reading"}
          value={meterReading.value.toString()}
          error={meterReading.error}
          onChangeText={(value) => {
            const val = parseFloat(value);
            setMeterReading({
              value: isNaN(val) ? 0 : val,
              error: isNaN(val),
            });
          }}
        />
      )}

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
          loading || meterNumber.error || meterNumber.value.length === 0
        }
        mode="outlined"
        // onPress={async () => await submitImage()}
      >
        Submit Reading
      </Button>
    </View>
  );
};

const mapStateToProps = ({ user }: RootReducerI) => ({ user });

export default connect(mapStateToProps)(ReadMeterScreen);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
    padding: 15,
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
