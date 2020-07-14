import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

export default function PrepaidComponent({ children }: any) {
  //   console.log(text);
  const { prepaid, headerText, flexRow, meterText } = styles;
  return (
    <View style={prepaid}>
      <Text style={headerText}>Purchase token for</Text>
      <View style={flexRow}>
        <Ionicons
          color={Colors.LwscOrange}
          size={20}
          name={`${Platform.OS === "ios" ? "ios" : "md"}-speedometer`}
        />
        <Text style={meterText}>{children}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  prepaid: {
    display: "flex",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: `${Colors.LwscSelectedBlue}44`,
  },
  headerText: {
    fontSize: 20,
  },
  meterText: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "900",
  },
  flexRow: {
    paddingTop: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
