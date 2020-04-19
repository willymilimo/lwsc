import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";

const NotificationsScreen = () => {
  const { container } = styles;
  return <SafeAreaView style={container}></SafeAreaView>;
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
  },
});
