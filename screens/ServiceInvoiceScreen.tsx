import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ServiceInvoiceI } from "../models/service-invoice";
import { ServiceApplicationI } from "../models/service-application";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { Subheading, Divider, Button } from "react-native-paper";
import { connect } from "react-redux";
import { RootReducerI } from "../redux/reducers";
import { ServiceItemI } from "../models/service-item";
import { BookNumberI } from "../models/meter-reading";
import { toFixed } from "../helpers/functions";
import Colors from "../constants/Colors";
import Strings from "../constants/Strings";
import { LinearGradient } from "expo-linear-gradient";

interface PropsI {
  services: ServiceItemI[];
  route: {
    params: {
      service: ServiceApplicationI;
      invoice: ServiceInvoiceI;
      bookNumber: BookNumberI;
    };
  };
}

const ServiceInvoiceScreen = ({ services, route }: PropsI) => {
  const navigator = useNavigation();
  const [loading, setLoading] = useState(false);
  const { container, flexRow, heading, value } = styles;
  const { service, invoice, bookNumber } = route.params;
  const {
    service_type,
    phone,
    email,
    address,
    description,
    meter_number,
    account_number,
    first_name,
    last_name,
  } = service;
  // console.log(bookNumber);
  const { customer_type, penalty_charge, fee_charge, total_charge } = invoice;

  const flexRowItem = (
    header: string,
    content: string | number,
    style = {}
  ) => {
    return (
      <View style={flexRow}>
        <Subheading style={heading}>{header}</Subheading>
        <Subheading style={[value, style]}>{content}</Subheading>
      </View>
    );
  };

  return (
    <LinearGradient
      start={[0, 0]}
      end={[1, 0]}
      colors={["#56cbf1", "#5a86e4"]}
      style={{ display: "flex", flex: 1 }}
    >
      <ScrollView style={container}>
        <View style={styles.content}>
          {flexRowItem(
            "Service Type",
            services.filter((s) => s._id === service_type)[0].title
          )}
          {flexRowItem("Name", `${first_name} ${last_name}`)}
          {flexRowItem("Phone #", phone)}
          {!!email && flexRowItem("Email", email)}
          {!!address && flexRowItem("Address", address)}
          {flexRowItem("Area", bookNumber.DESCRIBE)}
          {!!description && flexRowItem("Description", description)}
          {!!meter_number &&
            flexRowItem("Account #", account_number || meter_number)}
          <Divider style={{ marginVertical: 10 }} />

          {flexRowItem("Customer Type", customer_type, {
            textTransform: "capitalize",
          })}
          {flexRowItem("Penalty Charge", `ZMW${toFixed(penalty_charge)}`)}
          {flexRowItem("Fee Charge", `ZMW${toFixed(fee_charge)}`)}
          {flexRowItem(
            "Total Charge",
            `ZMW${toFixed(total_charge || penalty_charge + fee_charge)}`
          )}

          <Button
            style={{ marginTop: 15 }}
            contentStyle={{
              borderColor: Colors.linkBlue,
              borderWidth: 0.75,
              borderRadius: 5,
              backgroundColor: `${Colors.linkBlue}22`,
            }}
            color={`${Colors.LwscBlue}bb`}
            disabled={loading}
            loading={loading}
            //   icon="send"
            mode="outlined"
            onPress={() =>
              navigator.navigate(Strings.PaymentOptionsServicesScreen, {
                invoice,
                service,
                bookNumber,
              })
            }
          >
            Make Payment
          </Button>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const mapPropsToState = ({ services }: RootReducerI) => ({
  services,
});

export default connect(mapPropsToState)(ServiceInvoiceScreen);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: "white",
    padding: 10,
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 15,
    width: 120,
  },
  value: {
    fontSize: 14,
  },
  content: {
    borderRadius: 5,
    display: "flex",
    flexDirection: "column",
    padding: 15,
    // margin: 5,
    backgroundColor: "#fff",
    shadowColor: `${Colors.linkBlue}22`,

    elevation: 5,

    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
  },
});
