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
import { PropertyI, Property } from "../models/meter-reading";
import { FAB } from "react-native-paper";

export interface BillComponentI {
  account: AccountI | PropertyI | string;
  onPress?(e: GestureResponderEvent): void;
  style?: object;
  onRemove?(): void;
  onEdit?(): void;
}

export type BillComponentT = BillComponentI;

export default function BillComponent({
  account,
  onPress,
  style,
  onEdit,
  onRemove,
}: BillComponentI) {
  // console.log(onEdit, onRemove);
  const isProperty = account instanceof Property;
  // console.log(`isProperty: ${isProperty}`);
  // console.log(account);
  const numero = isProperty
    ? (account as PropertyI).PreviousReading
    : typeof account === "string"
    ? ""
    : (account as AccountI).BALANCE.toFixed(2).replace(
        /\d(?=(\d{3})+\.)/g,
        "$&,"
      );

  const {
    hightlightStyle,
    itemStyle,
    textStyle,
    itemContainer,
    itemTitle,
  } = styles;
  style = style
    ? { padding: 5, margin: 5, borderRadius: 5, ...style }
    : { padding: 5, margin: 5, borderRadius: 5 };
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
          {isProperty
            ? (account as PropertyI).displayPlotAddress
            : typeof account === "string"
            ? account
            : (account as AccountI).FULL_NAME}
        </Text>
        {typeof account !== "string" && (
          <View style={itemContainer}>
            <Text style={itemTitle}>Home Address</Text>
            <View style={itemStyle}>
              <Ionicons
                color={Colors.LwscOrange}
                size={20}
                name={`${Platform.OS === "ios" ? "ios" : "md"}-home`}
              />
              <Text style={textStyle}>
                {isProperty
                  ? (account as PropertyI).displayAddress
                  : (account as AccountI).ADDRESS}
              </Text>
            </View>
          </View>
        )}
        <View style={itemContainer}>
          <Text style={itemTitle}>{`${
            isProperty || typeof account === "string" ? "Meter" : "Account"
          } Number`}</Text>
          <View style={itemStyle}>
            <Ionicons
              color={Colors.LwscOrange}
              size={20}
              name={`${Platform.OS === "ios" ? "ios" : "md"}-speedometer`}
            />
            <Text style={textStyle}>
              {isProperty
                ? (account as PropertyI).MeterNumber
                : typeof account === "string"
                ? account
                : (account as AccountI).CUSTKEY}
            </Text>
          </View>
        </View>
        {typeof account !== "string" && (
          <View style={itemContainer}>
            <Text style={itemTitle}>
              {isProperty ? "Previous Meter Reading" : "Bill Balance"}
            </Text>
            <View style={itemStyle}>
              <Ionicons
                color={Colors.LwscOrange}
                size={20}
                name={`${Platform.OS === "ios" ? "ios" : "md"}-card`}
              />
              <Text style={textStyle}>{numero}</Text>
            </View>
          </View>
        )}
        {onRemove && (
          <LwscFAB
            style={{ right: 15, top: 15 }}
            icon={{ name: "cross", type: Entypo }}
            backgroundColor={Colors.danger.background}
            color={Colors.danger.color}
            onPress={() => onRemove()}
          />
        )}
        {onEdit && (
          <LwscFAB
            style={{ right: 15, top: 15 }}
            icon={{ name: "edit", type: Entypo }}
            backgroundColor={Colors.info.background}
            color={Colors.info.color}
            onPress={() => onEdit()}
          />
        )}
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
    padding: 10,
    margin: 5,
    backgroundColor: "#fff",
    shadowColor: `${Colors.linkBlue}22`,

    elevation: 5,

    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
  },
  itemContainer: {},
  itemStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    marginBottom: 2,
  },
  itemTitle: {
    fontWeight: "bold",
    color: "#0009",
  },
  textStyle: {
    marginLeft: 10,
    fontSize: 15,
    color: `${Colors.LwscBlack}bb`,
  },
});
