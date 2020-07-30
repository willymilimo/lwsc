import React from "react";
import { StyleSheet, Text, View, Image, Platform } from "react-native";
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
import { NavType } from "../types/nav-type";
import { AccountI, Account } from "../models/account";
import Strings from "../constants/Strings";
import { PaymentChannel } from "../types/payment-channel";
import { Ionicons } from "@expo/vector-icons";
import PrepaidComponent from "./reusable/PrepaidComponent";
import { PrepaidI } from "../models/prepaid";

interface PaymentMethodScreenI {
  navigation: NavType;
  route: {
    params: AccountI | PrepaidI | string;
  };
}

const PaymentMethodScreen = ({ navigation, route }: PaymentMethodScreenI) => {
  const { params } = route;
  const { container } = styles;
  const [checked, setChecked] = React.useState(PaymentChannel.airtel);

  return (
    <ScrollView style={container}>
      {params instanceof Account ? (
        <BillComponent account={params} />
      ) : (
        <PrepaidComponent>
          {typeof params === "string"
            ? params
            : (params as PrepaidI).meterNumber}
        </PrepaidComponent>
      )}
      <View style={{ padding: 10 }}>
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
          onValueChange={(value) => setChecked(value as PaymentChannel)}
        >
          {Object.values(paymentMethods).map(({ image, name }, index) => (
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
          style={{
            marginHorizontal: 10,
            marginVertical: 20,
            paddingVertical: 5,
          }}
          labelStyle={{ fontSize: 17 }}
          mode="contained"
          onPress={() =>
            navigation.navigate(Strings.PaymentScreen, {
              method: checked,
              params,
            })
          }
        >
          Proceed
        </Button>
      </View>
    </ScrollView>
  );
};

export default PaymentMethodScreen;

const paymentMethods = {
  [PaymentChannel["Airtel Money"]]: {
    name: PaymentChannel["airtel"],
    image: airtel_money,
  },
  [PaymentChannel.Zampay]: {
    name: PaymentChannel.zamtel,
    image: zampay,
  },
  [PaymentChannel["MTN Money"]]: {
    name: PaymentChannel.mtn,
    image: mtn_money,
  },
  [PaymentChannel["VISA/MasterCard"]]: {
    name: PaymentChannel.visa_master_card,
    image: debit_card,
  },
  // [PaymentType.AIRTEL_MONEY]: {
  //   name: PaymentType.AIRTEL_MONEY,
  //   image: airtel_money,
  // },
  // [PaymentType.MTN_MONEY]: {
  //   name: PaymentType.MTN_MONEY,
  //   image: mtn_money,
  // },
  // [PaymentType.ZAMTEL_KWACHA]: {
  //   name: PaymentType.ZAMTEL_KWACHA,
  //   image: zampay,
  // },
  // [PaymentType.VISA]: {
  //   name: PaymentType.VISA,
  //   image: debit_card,
  // },
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "white",
  },
});
