import React from "react";
import { StyleSheet, Text, View } from "react-native";
import BillComponent from "../components/BillComponent";

const MakePaymentScreen = () => {
  const { container } = styles;
  return (
    <View style={container}>
      <BillComponent
        account_number="2323232323"
        address="32 Becker Street"
        usage={89}
        _id="92FA9D4C-F498-CDA7-A1DC-51ABB1C36712"
        meter_number="232323232323"
        meter_reading={2}
        name="Some Random Dude"
        amount_due={23}
        style={{height: 160}}
      />
    </View>
  );
};

export default MakePaymentScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
  },
});
