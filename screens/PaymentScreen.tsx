import React, { useState } from "react";
import { StyleSheet, View, Image, Text, Alert, Modal, BackHandler } from "react-native";
import NetInfo from "@react-native-community/netinfo";

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
import {
  IconButton,
  Checkbox,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import LwscTextInput from "../components/LwscTextInput";
import Regex from "../constants/Regex";
import { toFixed } from "../helpers/functions";
import { makePayment } from "../models/axios";
import { Payment, PaymentI } from "../models/payment";
import Strings from "../constants/Strings";
import { ControlIT } from "../models/control";
import { Bowser } from "../models/bowser";
import { CustomerType } from "../types/customer-type";
import { PaymentChannel } from "../types/payment-channel";
import PrepaidComponent from "./reusable/PrepaidComponent";
import { PrepaidI, Prepaid } from "../models/prepaid";

interface PaymentScreenI {
  navigation: NavType;
  route: {
    params: {
      params: AccountI | PrepaidI;
      method: PaymentChannel;
    };
  };
}

const PaymentScreen = ({ navigation, route }: PaymentScreenI) => {
  const { container, methodStyle, formContainer, contentBox } = styles;
  const { params, method } = route.params;
  // console.log(route.params);
  const { image, placeholder } = Items[method];
  // console.log(params, method, image, placeholder);
  const isPrepaid = params instanceof Prepaid;
  const [meterNumber, setMeterNumber] = useState<ControlIT<string>>({
    value: isPrepaid ? (params as Prepaid).meterNumber : "",
    error: false,
  });
  const [phone, setPhone] = useState<ControlIT<string>>({
    value: "",
    error: false,
  });
  const [email, setEmail] = useState<ControlIT<string>>({
    value: params instanceof Account ? params.STATEMENT_DELIVERY_BY_EMAIL : "",
    error: false,
  });
  const [amount, setAmount] = useState(
    params instanceof Bowser ? params.totalPrice.toString() : ""
  );
  const [firstName, setFirstName] = useState<ControlIT<string>>({
    value: "",
    error: false,
  });
  const [lastName, setLastName] = useState<ControlIT<string>>({
    value: "",
    error: false,
  });
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

  async function processPayment(payment: PaymentI) {
    console.log(payment);
    setLoading(true);
    makePayment(payment)
      .then(({ data, status }) => {
        const { success, error, payload, message } = data;

        if (status === 200) {
          if (success) {
            if (method === PaymentChannel.visa_master_card) {
              navigation.navigate(Strings.WebviewScreen, payload);
            } else if (method === PaymentChannel.zamtel) {
              Alert.alert(
                Strings.PAYMENT_SUCCESS.title,
                Strings.PAYMENT_SUCCESS.message,
                [
                  {
                    text: "OK",
                    onPress: () =>
                      navigation.navigate(Strings.HomeTabNavigator),
                  },
                ]
              );
            } else {
              Alert.alert(
                Strings.PIN_INPUT.title,
                Strings.PIN_INPUT.message.replace("{pin}", method),
                [
                  {
                    text: "OK",
                    onPress: () =>
                      navigation.navigate(Strings.HomeTabNavigator),
                  },
                ]
              );
            }
          } else {
            let msg =
              message ||
              error ||
              Strings.PIN_INPUT.message.replace("{pin}", method);

            // if (msg.toLowerCase() === "transaction initiation failed")
            if (isPrepaid) {
              msg += ". Please ensure to input a valid Meter Number.";
            }

            Alert.alert("Payment Not Approved", msg);
          }
        } else {
          console.error(data);
          throw new Error("We did not get a 200 instead got a " + status);
        }
      })
      .catch((err) => {
        console.log(err);
        Alert.alert(
          Strings.SELF_REPORTING_PROBLEM.title,
          Strings.SELF_REPORTING_PROBLEM.message
        );
      })
      .finally(() => setLoading(false));
  }

  async function makePaymentRequest() {
    let payment: PaymentI;

    if (isPrepaid) {
      payment = new Payment({
        account_number: "",
        meter_number: meterNumber.value,
        first_name: firstName.value,
        last_name: lastName.value,
        customer_type: CustomerType.prepaid,
        amount,
        payment_channel: PaymentChannel[method],
        phone_number: phone.value,
        email: email.value,
      });
    } else {
      const accnt = params as AccountI;
      payment = new Payment({
        account_number: accnt.CUSTKEY,
        meter_number: accnt.CUSTKEY,
        first_name: accnt.INITIAL,
        last_name: accnt.SURNAME,
        customer_type: CustomerType.postpaid,
        amount,
        payment_channel: PaymentChannel[method],
        phone_number: phone.value,
        email: email.value || accnt.STATEMENT_DELIVERY_BY_EMAIL,
      });
    }

    if (method === PaymentChannel.zamtel) {
      Alert.alert(
        Strings.PIN_INPUT.title,
        `${Strings.PIN_INPUT.message.replace(
          "{pin}",
          method
        )} Tap PROCEED to continue.`,
        [
          {
            text: "PROCEED",
            onPress: async () => processPayment(payment),
          },
        ]
      );
    } else {
      processPayment(payment);
    }
  }

  // React.useEffect(() => {
  //   NetInfo.addEventListener((state) => {
  //     if (!state.isConnected) {
  //       Alert.alert(
  //         Strings.INTERNET_FAILURE.title,
  //         Strings.INTERNET_FAILURE.message,
  //         [{ text: "Exit", onPress: () => BackHandler.exitApp() }]
  //       );
  //     }
  //   });
  // }, []);

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
        // <PrepaidComponent>{(params as PrepaidI).meterNumber}</PrepaidComponent>
        <></>
      )}
      <View style={contentBox}>
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
          {isPrepaid && (
            <>
              <TextInput
                style={{ marginBottom: 15 }}
                mode="outlined"
                label="Meter Number"
                placeholder={`e.g. 41130324183`}
                value={meterNumber.value}
                error={meterNumber.error}
                disabled={loading}
                onChangeText={(text) =>
                  setMeterNumber({
                    value: text,
                    error: !/^\d{5,}$/.test(text),
                  })
                }
              />
            </>
          )}
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

          {isPrepaid && (
            <>
              <TextInput
                style={{ marginTop: 10 }}
                mode="outlined"
                label="First Name"
                placeholder={`e.g. Isaac`}
                value={firstName.value}
                error={firstName.error}
                disabled={loading}
                onChangeText={(text) =>
                  setFirstName({
                    value: text,
                    error: !Regex.NAME.test(text),
                  })
                }
              />
              <TextInput
                style={{ marginTop: 10 }}
                mode="outlined"
                label="Last Name"
                placeholder={`e.g. Isaac`}
                value={lastName.value}
                error={lastName.error}
                disabled={loading}
                onChangeText={(text) =>
                  setLastName({
                    value: text,
                    error: !Regex.NAME.test(text),
                  })
                }
              />
            </>
          )}

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
                error: phone.error,
              });
            }}
            onChangeText={(text) =>
              setPhone({
                value: text,
                error: !Regex.ZAMBIAN_MOBILE_NUMBER.test(text),
              })
            }
          />

          {method === PaymentChannel.visa_master_card ||
            (isPrepaid && (
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
            ))}

          <Button
            disabled={
              loading ||
              !Regex.ZAMBIAN_MOBILE_NUMBER.test(phone.value) ||
              !/^\d+$/.test(amount) ||
              (method === PaymentChannel.visa_master_card &&
                !Regex.EMAIL.test(email.value))
            }
            style={{ marginVertical: 20, paddingVertical: 5 }}
            labelStyle={{ fontSize: 17 }}
            mode="contained"
            onPress={confirmPayment}
          >
            Make Payment
          </Button>
        </View>
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
  contentBox: {
    padding: 10,
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
