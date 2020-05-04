import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { NavType } from "../types/nav-type";
import { AccountI } from "../models/account";
import { PaymentType } from "../types/payment";
import BillComponent from "../components/BillComponent";
import {
  airtel_money,
  mtn_money,
  zampay,
  debit_card,
} from "../constants/Images";
import Colors from "../constants/Colors";
import { IconButton, Checkbox, TextInput, Button } from "react-native-paper";
import LwscTextInput from "../components/LwscTextInput";
import Regex from "../constants/Regex";
import { toFixed } from "../helpers/functions";
import { makePayment } from "../models/axios";
import { Payment } from "../models/payment";
import Strings from "../constants/Strings";
import { ControlI } from "../models/control";

interface PaymentScreenI {
  navigation: NavType;
  route: {
    params: {
      account: AccountI;
      method: any;
    };
  };
}

const PaymentScreen = ({ navigation, route }: PaymentScreenI) => {
  const { container, methodStyle, formContainer, flexRow, prefix } = styles;
  const { account, method } = route.params;
  const { image, placeholder, regex } = Items[method];
  const [phone, setPhone] = useState<ControlI>({ value: "", error: false });
  const [email, setEmail] = useState<ControlI>({ value: "", error: false });
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const confirmPayment = () => {
    if (!(phone.error || !/^\d+$/.test(amount) || email.error)) {
      //   setLoading(true);
      const methodDetails =
        method === PaymentType.VISA
          ? `${method} reference contacts ${email.value} and ${phone.value}`
          : `${method} - ${phone.value}`;
      Alert.alert(
        "Make Payment?",
        `You are paying the amount of ZMW ${toFixed(amount)} for ${
          account.FULL_NAME
        } at ${
          account.ADDRESS
        } using ${methodDetails}. Are you sure you want to continue with the payment?`,
        [
          {
            text: "Cancel",
          },
          {
            text: "Proceed",
            onPress: async () => await makePaymentRequest(),
          },
        ]
      );
    }
  };

  async function makePaymentRequest() {
    const payment = new Payment({
      account_number: account.CUSTKEY,
      payment_type: method,
      amount,
      customer_phone_number: phone.value,
      email: email.value,
    });
    // makePayment
    console.log(payment);
    setLoading(true);
    makePayment(payment)
      .then((res) => {
        // console.log(res.data);
        const { success, error, payload, message } = res.data;

        if (success) {
          if (method === PaymentType.VISA) {
            navigation.navigate(Strings.WebviewScreen, payload);
          }
        } else {
          Alert.alert(
            "Payment Not Approved",
            `Please ensure you approve the payment by inputting your ${method} pin in the push request.`
          );
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }

  return (
    <ScrollView style={container}>
      <Modal animationType="slide" transparent={true} visible={loading}>
        <View style={[styles.centeredView, { backgroundColor: "#00000077" }]}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large" color={Colors.LwscOrange} />
          </View>
        </View>
      </Modal>

      <BillComponent account={account} />
      <View style={methodStyle}>
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
              color: Colors.whiteColor,
            }}
          >
            {method}
          </Text>
        </View>
        <Checkbox status="checked" color="white" />
      </View>
      <View style={formContainer}>
        <LwscTextInput
          onChangeText={setAmount}
          prefix="ZMW"
          label="Amount"
          money={true}
          validator={/^\d+$/}
          loading={loading}
        />

        <TextInput
          style={{ marginTop: 10 }}
          mode="outlined"
          label="Phone Number"
          keyboardType="phone-pad"
          placeholder={`e.g. ${placeholder}`}
          value={phone.value}
          error={phone.error}
          disabled={loading}
          onChangeText={(text) =>
            setPhone({
              value: text,
              error: !regex.test(text),
            })
          }
        />

        {method === PaymentType.VISA && (
          <TextInput
            style={{ marginTop: 10 }}
            mode="outlined"
            label="Email Address"
            keyboardType="email-address"
            placeholder={`e.g. example@lwsc.co.zm`}
            value={email.value}
            error={email.error}
            disabled={loading}
            onChangeText={(text) =>
              setEmail({
                value: text,
                error: !Regex.EMAIL.test(text),
              })
            }
          />
        )}

        <Button
          disabled={
            loading || phone.error || !/^\d+$/.test(amount) || email.error
          }
          style={{ marginVertical: 20, paddingVertical: 5 }}
          labelStyle={{ fontSize: 17 }}
          mode="contained"
          onPress={confirmPayment}
        >
          Make Payment
        </Button>
      </View>
    </ScrollView>
  );
};

export default PaymentScreen;

const Items = {
  [PaymentType.AIRTEL_MONEY]: {
    image: airtel_money,
    placeholder: "0978271892 or 0778271892",
    regex: Regex.AIRTEL_NUMBER,
  },
  [PaymentType.MTN_MONEY]: {
    image: mtn_money,
    placeholder: "0968271892 or 0768271892",
    regex: Regex.MTN_NUMBER,
  },
  [PaymentType.ZAMTEL_KWACHA]: {
    image: zampay,
    placeholder: "0955549887",
    regex: Regex.ZAMTEL_NUMBER,
  },
  [PaymentType.VISA]: {
    image: debit_card,
    placeholder: "0968271892",
    regex: Regex.ZAMTEL_NUMBER,
  },
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  methodStyle: {
    borderWidth: 0.5,
    borderTopWidth: 0.5,
    borderColor: Colors.lightGray,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.LwscSelectedBlue,
  },
  formContainer: {
    display: "flex",
    marginHorizontal: 5,
    marginTop: 10,
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    borderRadius: 5,
    borderColor: `${Colors.LwscBlack}99`,
    borderWidth: 0.5,
    paddingHorizontal: 10,
  },
  prefix: {
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
