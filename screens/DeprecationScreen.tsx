import React from "react";
import { Appbar, Button } from "react-native-paper";
import { StyleSheet, Text, View, Platform, Linking, Alert } from "react-native";
import Colors from "../constants/Colors";

export default function DeprecationScreen() {
  const handleUpdate = () => {
    const play_appstore =
      Platform.OS == "ios"
        ? `https://itunes.apple.com/google`
        : `market://details?id=google`;

    Linking.canOpenURL(play_appstore)
      .then((isSupported) => {
        console.log(isSupported);
        if (isSupported) Linking.openURL(play_appstore);
      })
      .catch((err) => {
        const store = Platform.OS == "ios" ? "App Store" : "Google Play Store";
        Alert.alert(
          `${store} Missing`,
          `Unable to open ${name}. Please ensure you have a ${store} installed.`
        );
      });
  };

  return (
    <View style={styles.container}>
      <Appbar style={styles.bottom}>
        <Appbar.Content title="Update Required" />
      </Appbar>
      <View style={styles.items}>
        <Text>
          You are currently running a deprecated version of the application.
          Please update.
        </Text>
        <Button
          style={{ marginTop: 15 }}
          contentStyle={{
            borderColor: Colors.linkBlue,
            borderWidth: 0.75,
            borderRadius: 5,
            backgroundColor: `${Colors.linkBlue}22`,
          }}
          color={`${Colors.LwscBlue}bb`}
          mode="outlined"
          onPress={handleUpdate}
        >
          Update Now
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottom: {
    backgroundColor: Colors.LwscBlue,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
  },
  items: {
    marginTop: 56,
    flex: 1,
    padding: 10,
  },
});
