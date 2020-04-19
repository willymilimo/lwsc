import React from "react";
import { Text, StyleSheet, View, SafeAreaView } from "react-native";
import HeaderComponent from "../components/HeaderComponent";

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
