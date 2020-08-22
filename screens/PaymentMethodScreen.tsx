import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, Alert } from "react-native";
import BillComponent from "../components/BillComponent";
import Colors from "../constants/Colors";
import {
  airtel_money,
  mtn_money,
  zampay,
  debit_card,
} from "../constants/Images";
import {
  Button,
  IconButton,
  RadioButton,
  ActivityIndicator,
} from "react-native-paper";
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import { NavType } from "../types/nav-type";
import { AccountI, Account } from "../models/account";
import Strings from "../constants/Strings";
import { PaymentChannel, PaymentChannelI } from "../types/payment-channel";
import PrepaidComponent from "./reusable/PrepaidComponent";
import { PrepaidI, Prepaid } from "../models/prepaid";
import { fetchPaymentChannels } from "../models/axios";
import { ServiceInvoiceI } from "../models/service-invoice";
import { ServiceApplicationI } from "../models/service-application";
import ServiceComponent from "../components/ServiceComponent";
import { BookNumberI } from "../models/meter-reading";

interface PaymentMethodScreenI {
  navigation: NavType;
  route: {
    params:
      | AccountI
      | PrepaidI
      | string
      | {
          invoice: ServiceInvoiceI;
          service: ServiceApplicationI;
          bookNumber: BookNumberI;
        };
  };
}

const PaymentMethodScreen = ({ navigation, route }: PaymentMethodScreenI) => {
  const { params } = route;
  const { container } = styles;
  const [checked, setChecked] = useState(PaymentChannel.airtel);
  const [
    selectedChannel,
    setSelectedChannel,
  ] = useState<PaymentChannelI | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentChannels, setPaymentChannels] = useState<PaymentChannelI[]>([]);

  const getPaymentChannels = () => {
    setLoading(true);
    fetchPaymentChannels()
      .then(({ status, data }) => {
        if (status === 200 && data.success) {
          setPaymentChannels(data.payload);
          if (data.payload.length) {
            setChecked(data.payload[0].id);
            setSelectedChannel(data.payload[0]);
            // console.log(PaymentChannel);
          }
        } else {
          throw new Error("unexpected response from server");
        }
      })
      .catch((err) => {
        const { title, message } = Strings.SELF_REPORTING_PROBLEM;
        Alert.alert(title, message, [{ onPress: () => navigation.goBack() }]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let is_subscribed = true;

    if (is_subscribed) {
      getPaymentChannels();
    }

    return () => {
      is_subscribed = false;
    };
  }, [route]);

  return (
    <ScrollView style={container}>
      {loading ? (
        <ActivityIndicator
          style={{ alignSelf: "center", marginTop: 20 }}
          size="large"
          color={Colors.LwscOrange}
        />
      ) : (
        <>
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
              {paymentChannels.map((channel, index) => {
                const { _id, title, id } = channel;
                return (
                  <TouchableHighlight
                    underlayColor={Colors.lightBorderColor}
                    onPress={() => {
                      setChecked(id);
                      setSelectedChannel(channel);
                    }}
                    style={{
                      marginHorizontal: 10,
                      backgroundColor:
                        id === checked
                          ? Colors.LwscSelectedBlue
                          : "transparent",
                    }}
                    key={_id}
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
                              source={getImage(id)}
                            />
                          )}
                        />
                        <Text
                          style={{
                            fontWeight: "900",
                            fontSize: 18,
                            color:
                              id === checked
                                ? Colors.whiteColor
                                : Colors.LwscBlackLighter,
                          }}
                        >
                          {title}
                        </Text>
                      </View>
                      <RadioButton
                        color="white"
                        uncheckedColor="#3366cc"
                        value={id}
                      />
                    </View>
                  </TouchableHighlight>
                );
              })}
            </RadioButton.Group>
            <Button
              disabled={selectedChannel == null}
              style={{
                marginHorizontal: 10,
                marginVertical: 20,
                paddingVertical: 5,
              }}
              labelStyle={{ fontSize: 17 }}
              mode="contained"
              onPress={() =>
                navigation.navigate(Strings.PaymentScreen, {
                  method: selectedChannel,
                  params,
                })
              }
            >
              Proceed
            </Button>
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default PaymentMethodScreen;

const getImage = (id: string) => {
  switch (id) {
    case "airtel":
      return airtel_money;
    case "zamtel":
      return zampay;
    case "mtn":
      return mtn_money;
    default:
      return debit_card;
  }
};

// const paymentMethods = {
//   [PaymentChannel["Airtel Money"]]: {
//     name: PaymentChannel["airtel"],
//     image: airtel_money,
//   },
//   [PaymentChannel.Zampay]: {
//     name: PaymentChannel.zamtel,
//     image: zampay,
//   },
//   [PaymentChannel["MTN Money"]]: {
//     name: PaymentChannel.mtn,
//     image: mtn_money,
//   },
//   [PaymentChannel["VISA/MasterCard"]]: {
//     name: PaymentChannel.visa_master_card,
//     image: debit_card,
//   },
// };

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    // backgroundColor: "white",
  },
});
