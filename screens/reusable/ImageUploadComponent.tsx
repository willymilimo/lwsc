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
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import Strings from "../../constants/Strings";
import { useNavigation } from "@react-navigation/native";
import { uploadFiles } from "../../models/axios";
import { UploadFileI } from "../../models/upload-file";

interface IUC {
  uploadCallback(uploadFile: UploadFileI[]): void;
}

export default function ImageUploadComponent({ uploadCallback }: IUC) {
  const navigator = useNavigation();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<
    (ImagePicker.ImagePickerResult & ImageInfo) | null
  >(null);

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
    setLoading(true);
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
    });

    if (!result.cancelled && result.base64) {
      // console.log(result.base64);
      // setImage("data:image/jpeg;base64," + result.base64);
      // setImage(result.base64);
      setImage(result);

      uploadFiles([result.uri])
        .then(({ status, data }) => {
          const { success, payload } = data;
          if (status === 200 && success && payload.length) {
            uploadCallback(payload);
          } else {
            Alert.alert(
              Strings.IMG_UPLOAD_FAILURE.title,
              Strings.IMG_UPLOAD_FAILURE.message,
              [
                {
                  text: "Ok",
                  onPress: () => navigator.navigate(Strings.HomeTabNavigator),
                },
              ]
            );
          }
        })
        .catch((err) => {
          Alert.alert(
            Strings.SELF_REPORTING_PROBLEM.title,
            Strings.SELF_REPORTING_PROBLEM.message,
            [
              {
                text: "Ok",
                onPress: () => navigator.navigate(Strings.HomeTabNavigator),
              },
            ]
          );
        })
        .finally(() => setLoading(false));
      //   uploadCallback(result.base64);
    } else {
      setLoading(false);
    }
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
          loading={loading}
          contentStyle={{
            borderColor: Colors.linkBlue,
            borderWidth: 0.75,
            borderRadius: 5,
            backgroundColor: `${Colors.linkBlue}22`,
          }}
          color={`${Colors.LwscBlue}bb`}
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
