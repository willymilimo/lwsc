import React from "react";
import { BillI } from "../models/bill";
import { StyleSheet, View, Text, Platform } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import Colors from "../constants/Colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function BillComponent({
  name,
  address,
  account_number,
  meter_number,
  meter_reading,
  usage,
  amount_due,
  onPress,
}: BillI) {
  const { hightlightStyle, itemStyle, textStyle } = styles;
  return (
    <TouchableHighlight
      onPress={onPress}
      underlayColor={`${Colors.LwscBlack}44`}
      style={{ padding: 2, margin: 5, borderRadius: 5 }}
    >
      <View style={hightlightStyle}>
        <Text style={{ fontSize: 20, marginBottom: 5 }}>{name}</Text>
        <View style={itemStyle}>
          <Ionicons
            color={Colors.LwscOrange}
            size={20}
            name={`${Platform.OS === "ios" ? "ios" : "md"}-home`}
          />
          <Text style={textStyle}>{address}</Text>
        </View>
        <View style={itemStyle}>
          <Ionicons
            color={Colors.LwscOrange}
            size={20}
            name={`${Platform.OS === "ios" ? "ios" : "md"}-speedometer`}
          />
          <Text style={textStyle}>{meter_number || account_number}</Text>
        </View>
        <View style={itemStyle}>
          <MaterialCommunityIcons
            color={Colors.LwscOrange}
            size={20}
            name={`water-pump`}
          />
          <Text style={textStyle}>{`${meter_reading || usage} Litres`}</Text>
        </View>
        <View style={itemStyle}>
          <Ionicons
            color={Colors.LwscOrange}
            size={20}
            name={`${Platform.OS === "ios" ? "ios" : "md"}-card`}
          />
          <Text style={textStyle}>{`ZMW ${amount_due
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,")}`}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  hightlightStyle: {
    borderRadius: 5,
    display: "flex",
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: Colors.LwscBlue,

    elevation: 3,

    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.75,
    shadowRadius: 3,
  },
  itemStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    marginBottom: 2,
  },
  textStyle: {
    marginLeft: 10,
    fontSize: 15,
    color: `${Colors.LwscBlack}bb`,
  },
});
