import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Camera } from "expo-camera";

export const requestCameraPermission = async (setHasPermission: Function) => {
  const { status } = await Camera.requestPermissionsAsync();
  setHasPermission(status === "granted");
};

export default function permissions() {
  const [hasPermission, setHasPermission] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  return (
    <View>
      <Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({});
