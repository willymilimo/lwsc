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
import { PaymentType } from "../types/payment";

const PaymentMethodScreen = () => {
  const { container } = styles;
  const [checked, setChecked] = React.useState(PaymentType["Airtel Money"]);

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
      <RadioButton.Group
        value={checked}
        onValueChange={(value) => setChecked(value as PaymentType)}
      >
        {paymentMethods.map(({ image, name }, index) => (
          <TouchableHighlight
            underlayColor={Colors.lightBorderColor}
            onPress={() => setChecked(name)}
            style={{
              marginHorizontal: 10,
              backgroundColor:
                name === checked ? Colors.LwscSelectedBlue : "transparent",
            }}
            key={name}
          >
            <View
              style={{
                borderWidth: 0.5,
                borderTopWidth: index !== 0 ? 0 : 0.5,
                borderColor: Colors.lightGray,
                paddingHorizontal: 10,
                // paddingVertical: 8,
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
                  size={40}
                  icon={({ size, color }) => (
                    <Image
                      style={{ height: size, width: size }}
                      height={size}
                      width={size}
                      source={image}
                    />
                  )}
                />
                <Text
                  style={{
                    fontWeight: "900",
                    fontSize: 18,
                    color:
                      name === checked
                        ? Colors.whiteColor
                        : Colors.LwscBlackLighter,
                  }}
                >
                  {name}
                </Text>
              </View>
              <RadioButton
                color="white"
                uncheckedColor="#3366cc"
                value={name}
              />
            </View>
          </TouchableHighlight>
        ))}
      </RadioButton.Group>
      <Button
        disabled={!(checked in PaymentType)}
        style={{ marginHorizontal: 10, marginVertical: 20 }}
        mode="contained"
        onPress={() => console.log(checked)}
      >
        Proceed
      </Button>
    </ScrollView>
  );
};

export default PaymentMethodScreen;

const paymentMethods = [
  {
    name: PaymentType["Airtel Money"],
    image: airtel_money,
  },
  {
    name: PaymentType["MTN Money"],
    image: mtn_money,
  },
  {
    name: PaymentType.Zampay,
    image: zampay,
  },
  {
    name: PaymentType["Debit/ATM Card"],
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
