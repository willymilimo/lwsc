import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Platform,
  Image,
  Alert,
  BackHandler,
} from "react-native";
import { FAB, Button } from "react-native-paper";
import Colors from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import Strings from "../../constants/Strings";
import { useNavigation } from "@react-navigation/native";
import { uploadFiles, upload } from "../../models/axios";
import { UploadFileI } from "../../models/upload-file";
import * as FileSystem from "expo-file-system";

interface IUC {
  buttonName?: string;
  uploadCallback(uploadFile: UploadFileI[]): void;
  deleteCallback?(): void;
  contentStyle?: any;
  color?: string;
  labelStyle?: any;
}

export default function ImageUploadComponent({
  buttonName,
  uploadCallback,
  deleteCallback,
  contentStyle,
  labelStyle,
  color,
}: IUC) {
  const navigator = useNavigation();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<ImageManipulator.ImageResult | null>(null);

  contentStyle = contentStyle || {};
  color = color || `${Colors.LwscBlue}bb`;
  labelStyle = labelStyle || {};

  const convertImage = async (
    image: {
      cancelled: false;
    } & ImageInfo
  ) => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        image.uri,
        [],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );

      const url =
        "https://lwsc.microtech.co.zm/api/v1/uploads/files/disk/create";

      const { status, body} = await FileSystem.uploadAsync(url, manipResult.uri, {});
      const { success, payload } = JSON.parse(body);

      // manipResult.uri
      // console.log(manipResult.uri);
      // const uri = manipResult.uri.replace(/.jpg$/i, ".jpg");
      // console.log(uri);
      // const res = await upload(manipResult.uri);
      // console.log(res.status, res.statusText)

      if (status === 200 && success && payload.length) {
        uploadCallback(payload);
        setImage(manipResult);
      } else {
        throw new Error(body);
      }
    } catch (err) {
      console.log(err);
      Alert.alert(
        Strings.SELF_REPORTING_PROBLEM.title,
        Strings.SELF_REPORTING_PROBLEM.message
        // [
        //   {
        //     text: "Ok",
        //     onPress: () => navigator.navigate(Strings.HomeTabNavigator),
        //   },
        // ]
      );
    }
  };

  const requestCameraPermissionAsync = async () => {
    var { status } = await ImagePicker.requestCameraPermissionsAsync(); // Permissions.askAsync(Permissions.CAMERA);
    if (status !== "granted") {
      const { title, message } = Strings.CAMERA_PERMISSION;
      Alert.alert(title, message, [
        {
          text: "Grant Permission",
          onPress: async () =>
            await ImagePicker.requestCameraPermissionsAsync(),
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
    setLoading(true);
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
    });

    if (!result.cancelled && result.base64 && result.uri) {
      // console.log(result.base64);
      // setImage("data:image/jpeg;base64," + result.base64);
      // setImage(result.base64);
      // console.log(result.uri)
      // setImage(result);

      await convertImage(result);
      //   uploadCallback(result.base64);
    }
    setLoading(false);
  };

  useEffect(() => {
    let is_subscribed = true;

    if (is_subscribed) {
      requestCameraPermission();
    }

    return () => {
      is_subscribed = false;
    };
  }, []);

  return (
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
            onPress={() => {
              setImage(null);
              if (typeof deleteCallback === "function") deleteCallback();
            }}
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
          loading={loading}
          disabled={loading}
          contentStyle={{
            borderColor: Colors.linkBlue,
            borderWidth: 0.75,
            borderRadius: 5,
            backgroundColor: `${Colors.linkBlue}22`,
            ...contentStyle,
          }}
          color={color}
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
          {buttonName || "CAPTURE LEAK"}
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    backgroundColor: "red",
    position: "absolute",
    zIndex: 999,
    margin: 16,
    right: 0,
    top: 0,
  },
});
