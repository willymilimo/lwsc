import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import BillComponent from "../components/BillComponent";
import Colors from "../constants/Colors";
import {
  airtel_money,
  mtn_money,
  zampay,
  debit_card,
} from "../constants/Images";
import { Button, IconButton, RadioButton } from "react-native-paper";
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";

const MakePaymentScreen = () => {
  const { container } = styles;
  const [checked, setChecked] = React.useState("");

  return (
    <ScrollView style={container}>
      <BillComponent
        account_number="2323232323"
        address="32 Becker Street"
        usage={89}
        _id="92FA9D4C-F498-CDA7-A1DC-51ABB1C36712"
        meter_number="232323232323"
        meter_reading={2}
        name="Some Random Dude"
        amount_due={23}
        style={{ height: 160 }}
      />
      <Text
        style={{
          marginHorizontal: 10,
          marginVertical: 10,
          fontSize: 18,
          color: `${Colors.LwscBlack}ab`,
          fontWeight: "bold",
        }}
      >
        Payment Method
      </Text>
      {paymentMethods.map(({ image, name }, index) => (
        <TouchableHighlight
          underlayColor={Colors.lightBorderColor}
          onPress={() => setChecked(name)}
          style={{
            marginHorizontal: 10,
          }}
          key={name}
        >
          <View
            style={{
              borderWidth: 0.5,
              borderTopWidth: index !== 0 ? 0 : 0.5,
              borderColor: Colors.gray3AColor,
              paddingHorizontal: 10,
              paddingVertical: 8,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <IconButton
                style={{ borderRadius: 25 }}
                size={30}
                icon={({ size, color }) => (
                  <Image
                    style={{ height: size, width: size }}
                    height={size}
                    width={size}
                    source={image}
                  />
                )}
              />
              <Text style={{ fontWeight: "900", fontSize: 18 }}>{name}</Text>
            </View>
            <RadioButton
              value={name}
              status={checked === name ? "checked" : "unchecked"}
              onPress={() => setChecked(name)}
            />
          </View>
        </TouchableHighlight>
      ))}
      <Button
        disabled={checked === ""}
        style={{ marginHorizontal: 10, marginTop: 20 }}
        mode="contained"
        onPress={() => console.log(checked)}
      >
        Proceed
      </Button>
    </ScrollView>
  );
};

export default MakePaymentScreen;

const paymentMethods = [
  {
    name: "Airtel Money",
    image: airtel_money,
  },
  {
    name: "MTN Money",
    image: mtn_money,
  },
  {
    name: "Zampay",
    image: zampay,
  },
  {
    name: "Debit/ATM Card",
    image: debit_card,
  },
];

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
});
