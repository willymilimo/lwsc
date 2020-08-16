import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, Surface } from "react-native-paper";
import Colors from "../constants/Colors";

export default function VersionCheckScreen() {
  const { container, surface } = styles;
  return (
    <View style={container}>
      <Surface style={surface}>
        <ActivityIndicator size="large" color={Colors.LwscOrange} />
        <Text
          style={{
            marginTop: 20,
            textAlign: "center",
          }}
        >
          Loading necessary resources
        </Text>
        <Text
          style={{
            marginTop: 20,
            textAlign: "center",
          }}
        >{`Please wait...`}</Text>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },

  centeredView: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  surface: {
    padding: 20,
    // height: 80,
    // width: 80,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    alignSelf: "center",
    borderRadius: 10,
  },
});
