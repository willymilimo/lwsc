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
import { AccountI, Account } from "../models/account";
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
import { makePayment, makeMoMoPayment } from "../models/axios";
import { Payment } from "../models/payment";
import Strings from "../constants/Strings";
import { ControlIT } from "../models/control";
import { BowserI, Bowser } from "../models/bowser";
import { CustomerType } from "../types/customer-type";
import { PaymentChannel } from "../types/payment-channel";

interface PaymentScreenI {
  navigation: NavType;
  route: {
    params: {
      params: AccountI;
      method: PaymentChannel;
    };
  };
}

const PaymentScreen = ({ navigation, route }: PaymentScreenI) => {
  const { container, methodStyle, formContainer, flexRow, prefix } = styles;
  const { params, method } = route.params;
  // console.log(route.params);
  const { image, placeholder } = Items[method];
  // console.log(params, method, image, placeholder);
  const [phone, setPhone] = useState<ControlIT<string>>({
    value: "",
    error: false,
  });
  const [email, setEmail] = useState<ControlIT<string>>({
    value: "",
    error: false,
  });
  const [amount, setAmount] = useState(
    params instanceof Bowser ? params.totalPrice.toString() : ""
  );
  const [loading, setLoading] = useState(false);

  const confirmDetails =
    params instanceof Bowser
      ? {
          name: params.fullName,
          address: params.address,
        }
      : params instanceof Account
      ? { name: params.FULL_NAME, address: params.ADDRESS }
      : { name: "", address: "" };

  const confirmPayment = () => {
    const amnt = parseFloat(amount);
    if (isNaN(amnt) || amnt < 15) {
      Alert.alert(
        "Invalid Amount",
        "Please input a minimum amount of ZMW15.00"
      );
    } else if (!(phone.error || !/^\d+$/.test(amount) || email.error)) {
      //   setLoading(true);
      const methodDetails =
        method === PaymentChannel["VISA/MasterCard"]
          ? `${method} reference contacts ${email.value} and ${phone.value}`
          : `${method} - ${phone.value}`;
      Alert.alert(
        "Make Payment?",
        `You are paying the amount of ZMW ${toFixed(amount)} for ${
          confirmDetails.name
        } at ${
          confirmDetails.address
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
    const accnt = params as AccountI;
    const payment = new Payment({
      account_number: accnt.CUSTKEY,
      meter_number: accnt.CUSTKEY,
      first_name: accnt.INITIAL,
      last_name: accnt.SURNAME,
      customer_type: accnt.IS_METERED
        ? CustomerType.prepaid
        : CustomerType.postpaid,
      amount,
      payment_channel: PaymentChannel[method],
      phone_number: phone.value,
      email: email.value || accnt.STATEMENT_DELIVERY_BY_EMAIL,
    });
    // makePayment
    // const paymentMethod =
    //   method === PaymentChannel["VISA/MasterCard"]
    //     ? makePayment
    //     : makeMoMoPayment;
    console.log(payment);
    setLoading(true);
    makePayment(payment)
      .then((res) => {
        console.log(res.data);
        const { success, error, payload, message } = res.data;

        if (success) {
          if (method === PaymentChannel.visa_master_card) {
            navigation.navigate(Strings.WebviewScreen, payload);
          } else {
            Alert.alert(
              "Input Pin",
              `Please ensure you approve the payment by inputting your ${method} pin in the push request.`,
              [
                {
                  text: "OK",
                  onPress: () => navigation.navigate(Strings.HomeTabNavigator),
                },
              ]
            );
          }
        } else {
          Alert.alert("Payment Not Approved", res.data.error);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }

  return (
    <ScrollView style={container}>
      <Modal animationType="slide" transparent visible={loading}>
        <View style={[styles.centeredView, { backgroundColor: "#00000077" }]}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large" color={Colors.LwscOrange} />
          </View>
        </View>
      </Modal>

      {params instanceof Account ? (
        <BillComponent account={params} />
      ) : (
        <View />
      )}
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
          defaultValue={amount}
          prefix="ZMW"
          label="Amount"
          money={true}
          validator={/^\d+$/}
          loading={loading}
          disabled={params instanceof Bowser}
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
          onBlur={() => {
            setPhone({
              value: `260${phone.value.slice(-9)}`,
              error: phone.error
            })
          }}
          onChangeText={(text) =>
            setPhone({
              value: text,
              error: !Regex.ZAMBIAN_MOBILE_NUMBER.test(text),
            })
          }
        />

        {method === PaymentChannel.visa_master_card && (
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

const Items: { [key: string]: any } = {
  [PaymentChannel.airtel]: {
    image: airtel_money,
    placeholder: "0978271892 or 0778271892",
    regex: Regex.AIRTEL_NUMBER,
  },
  [PaymentChannel.mtn]: {
    image: mtn_money,
    placeholder: "0968271892 or 0768271892",
    regex: Regex.MTN_NUMBER,
  },
  [PaymentChannel.zamtel]: {
    image: zampay,
    placeholder: "0955549887",
    regex: Regex.ZAMTEL_NUMBER,
  },
  [PaymentChannel.visa_master_card]: {
    image: debit_card,
    placeholder: "0955271892",
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
