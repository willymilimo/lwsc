import React from "react";
import { StyleSheet, Text, View } from "react-native";

const MakePaymentScreen = () => {
  const { container } = styles;
  return (
    <View style={container}>
      <Text>Make Payment</Text>
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
