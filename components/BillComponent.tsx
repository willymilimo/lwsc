import React from "react";
import { BillI } from "../models/bill";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  GestureResponderEvent,
} from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import Colors from "../constants/Colors";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { AccountI } from "../models/account";
import LwscFAB from "./LwscFAB";

export interface BillComponentI {
  account: AccountI;
  onPress?(e: GestureResponderEvent): void;
  style?: object;
  onRemove?(e: GestureResponderEvent): void;
  onEdit?(e: GestureResponderEvent): void;
}

export type BillComponentT = BillComponentI;

export default function BillComponent({
  account,
  onPress,
  style,
  onEdit,
  onRemove,
}: BillComponentI) {
  console.log(onEdit, onRemove)
  const { hightlightStyle, itemStyle, textStyle } = styles;
  style = style
    ? { padding: 1, margin: 5, borderRadius: 5, ...style }
    : { padding: 1, margin: 5, borderRadius: 5 };
  return (
    <TouchableHighlight
      onPress={onPress}
      underlayColor={`${Colors.LwscSelectedBlue}01`}
      style={style}
    >
      <View style={hightlightStyle}>
        <Text
          style={{
            fontSize: 20,
            marginBottom: 5,
            color: Colors.LwscSelectedBlue,
            fontWeight: "bold",
          }}
        >
          {account.FULL_NAME}
        </Text>
        <View style={itemStyle}>
          <Ionicons
            color={Colors.LwscOrange}
            size={20}
            name={`${Platform.OS === "ios" ? "ios" : "md"}-home`}
          />
          <Text style={textStyle}>{account.ADDRESS}</Text>
        </View>
        <View style={itemStyle}>
          <Ionicons
            color={Colors.LwscOrange}
            size={20}
            name={`${Platform.OS === "ios" ? "ios" : "md"}-speedometer`}
          />
          <Text style={textStyle}>{account.CUSTKEY}</Text>
        </View>
        {/* <View style={itemStyle}>
          <MaterialCommunityIcons
            color={Colors.LwscOrange}
            size={20}
            name={`water-pump`}
          />
          <Text style={textStyle}>{`${meter_reading || usage} Litres`}</Text>
        </View> */}
        <View style={itemStyle}>
          <Ionicons
            color={Colors.LwscOrange}
            size={20}
            name={`${Platform.OS === "ios" ? "ios" : "md"}-card`}
          />
          <Text style={textStyle}>{`ZMW ${account.BALANCE.toFixed(2).replace(
            /\d(?=(\d{3})+\.)/g,
            "$&,"
          )}`}</Text>
        </View>
        {onRemove && (
          <LwscFAB
            style={{ right: 15, top: 15 }}
            icon={{ name: "cross", type: Entypo }}
            backgroundColor={Colors.danger.background}
            color={Colors.danger.color}
            onPress={() => onRemove()}
          />
        )}
        <LwscFAB
            style={{ right: 15, top: 15 }}
            icon={{ name: "edit", type: Entypo }}
            backgroundColor={Colors.info.background}
            color={Colors.info.color}
            onPress={() => onEdit()}
          />
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
    backgroundColor: `${Colors.linkBlue}11`,
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: `${Colors.linkBlue}22`,

    elevation: 1,

    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
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
