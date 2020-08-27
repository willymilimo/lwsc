import React, { useState } from "react";
import { StyleSheet, View, Image, Text, Alert, Modal } from "react-native";

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
import Strings from "../constants/Strings";
import { ControlIT } from "../models/control";
import { PaymentChannel, PaymentChannelI } from "../types/payment-channel";
import { PrepaidI, Prepaid } from "../models/prepaid";
import { ServiceInvoiceI } from "../models/service-invoice";
import {
  ServiceApplicationI,
  ServiceApplication,
} from "../models/service-application";
import PrepaidComponent from "./reusable/PrepaidComponent";
import ServiceComponent from "../components/ServiceComponent";
import { BookNumberI } from "../models/meter-reading";
import { LinearGradient } from "expo-linear-gradient";
import { applyForService } from "../models/axios";

interface PaymentScreenI {
  navigation: NavType;
  route: {
    params: {
      params: {
        invoice: ServiceInvoiceI;
        service: ServiceApplicationI;
        bookNumber: BookNumberI;
      };
      method: PaymentChannelI;
    };
  };
}

const MakeServicePaymentScreen = ({ navigation, route }: PaymentScreenI) => {
  const { container, methodStyle, formContainer, contentBox } = styles;
  const { params, method } = route.params;
  const { invoice, service, bookNumber } = params;
  console.log(route.params);
  const { image, placeholder, regex } = getItem(method.id);
  // console.log(params, method, image, placeholder);
  const isPrepaid = params instanceof Prepaid;
  const [meterNumber, setMeterNumber] = useState<ControlIT<string>>({
    value: service.account_number || service.meter_number || "",
    error: false,
  });
  const [phone, setPhone] = useState<ControlIT<string>>({
    value: "",
    error: false,
  });
  const [email, setEmail] = useState<ControlIT<string>>({
    value: service.email || "",
    error: false,
  });
  const [amount, setAmount] = useState(invoice.totalcharge.toString() || "");
  // console.log((params as any).invoice.totalcharge)
  const [firstName, setFirstName] = useState<ControlIT<string>>({
    value: "",
    error: false,
  });
  const [lastName, setLastName] = useState<ControlIT<string>>({
    value: "",
    error: false,
  });
  const [loading, setLoading] = useState(false);

  const confirmPayment = (serviceApplication: ServiceApplicationI) => {
    const confirmDetails = {
      name: service.fullname,
      address: service.address,
    };

    if (!(phone.error || !/^\d+$/.test(amount) || email.error)) {
      //   setLoading(true);
      const methodDetails =
        method.id === "visa_master_card"
          ? `${method.title} reference contacts ${email.value} and ${phone.value}`
          : `${method.title} - ${phone.value}`;
      Alert.alert(
        "Make Payment?",
        `You are paying the amount of ZMW ${toFixed(amount)} for ${
          confirmDetails.name
        } ${
          confirmDetails.address
        } using ${methodDetails}. Are you sure you want to continue with the payment?`,
        [
          {
            text: "Cancel",
          },
          {
            text: "Continue",
            onPress: async () => await requestService(serviceApplication),
          },
        ]
      );
    }
  };

  async function requestService(serviceApplication: ServiceApplicationI) {
    console.log(serviceApplication);
    setLoading(true);

    applyForService(serviceApplication)
      .then(({ status, data }) => {
        const { success, error, payload, message } = data;

        if (status === 200) {
          if (success) {
            if (method.id === "visa_master_card") {
              navigation.navigate(Strings.WebviewScreen, payload);
            } else {
              Alert.alert(
                Strings.PIN_INPUT.title,
                Strings.PIN_INPUT.message.replace("{pin}", method.title),
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
              Strings.PIN_INPUT.message.replace("{pin}", method.title);

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
      .then()
      .finally(() => setLoading(false));
  }

  async function makePaymentRequest() {
    const serviceApplication: ServiceApplicationI = new ServiceApplication({
      ...service,
      service_type: service.service_type,
      first_name: service.first_name,
      last_name: service.last_name,
      phone: service.phone,
      email: service.email,
      area: bookNumber.DESCRIBE,
      address: service.address,
      description: service.description,
      post_to_customer_balance: service.post_to_customer_balance,
      bill_group: bookNumber.BILLGROUP,
      amount: invoice.totalcharge,
      phone_number: phone.value,
      payment_channel: method.id,
    });
    console.log(serviceApplication);

    confirmPayment(serviceApplication);
  }

  return (
    <LinearGradient
      start={[0, 0]}
      end={[1, 0]}
      colors={["#56cbf1", "#5a86e4"]}
      style={{ display: "flex", flex: 1 }}
    >
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
        ) : params instanceof Prepaid ? (
          <PrepaidComponent>
            {typeof params === "string"
              ? params
              : (params as PrepaidI).meterNumber}
          </PrepaidComponent>
        ) : (
          <ServiceComponent
            invoice={(params as any).invoice}
            service={(params as any).service}
          />
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
                {method.title}
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
              disabled={!!(params as any).invoice}
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
                  error: !regex.test(text),
                })
              }
            />

            {(method.id === "visa_master_card" || isPrepaid) && (
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
                loading ||
                !Regex.ZAMBIAN_MOBILE_NUMBER.test(phone.value) ||
                !regex.test(phone.value) ||
                !/^\d+$/.test(amount) ||
                (method.id === "visa_master_card" &&
                  !Regex.EMAIL.test(email.value))
              }
              color={Colors.LwscSelectedBlue}
              style={{
                marginVertical: 20,
                paddingVertical: 5,
                backgroundColor: Colors.LwscSelectedBlue,
              }}
              labelStyle={{ fontSize: 17, color: Colors.whiteColor }}
              mode="contained"
              onPress={makePaymentRequest}
            >
              Make Payment
            </Button>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default MakeServicePaymentScreen;

const getItem = (id: string) => {
  switch (id) {
    case "airtel":
      return {
        image: airtel_money,
        placeholder: "0978271892 or 0778271892",
        regex: Regex.AIRTEL_NUMBER,
      };
    case "zamtel":
      return {
        image: zampay,
        placeholder: "0955549887",
        regex: Regex.ZAMTEL_NUMBER,
      };
    case "mtn":
      return {
        image: mtn_money,
        placeholder: "0968271892 or 0768271892",
        regex: Regex.MTN_NUMBER,
      };
    default:
      return {
        image: debit_card,
        placeholder: "0955271892",
        regex: Regex.ZAMTEL_NUMBER,
      };
  }
};

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
