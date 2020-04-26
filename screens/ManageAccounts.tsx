import React from "react";
import { StyleSheet, Text, View, Platform, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import LwscFAB from "../components/LwscFAB";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

const ManageAccounts = () => {
  const { container, box } = styles;
  return (
    <View style={container}>
      <ScrollView style={box}>
        
      </ScrollView>
      <LwscFAB
        onPress={() => Alert.alert('test', 'test')}
        label="Add Account/Meter"
        labelStyle={{ width: 145 }}
        icon={{
          name: `${Platform.OS === "ios" ? "ios" : "md"}-add`,
          type: Ionicons,
        }}
        backgroundColor={Colors.LwscBlue}
        color="white"
      />
    </View>
  );
};

export default ManageAccounts;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
  },
  box: {
    display: "flex",
    flex: 1,
    padding: 15,
  },
});
