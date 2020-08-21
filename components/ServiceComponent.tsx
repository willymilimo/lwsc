import React from "react";
import { StyleSheet, View } from "react-native";
import Colors from "../constants/Colors";
import { ServiceInvoiceI } from "../models/service-invoice";
import { ServiceApplicationI } from "../models/service-application";
import { ServiceItemI } from "../models/service-item";
import { connect } from "react-redux";
import { RootReducerI } from "../redux/reducers";
import { Subheading } from "react-native-paper";
import { toFixed } from "../helpers/functions";

interface PropsI {
  invoice: ServiceInvoiceI;
  service: ServiceApplicationI;
  services: ServiceItemI[];
}

const ServiceComponent = ({ invoice, service, services }: PropsI) => {
  const { hightlightStyle, flexRow, heading, value } = styles;
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
    <View style={{ padding: 5 }}>
      <View style={hightlightStyle}>
        {flexRowItem(
          "Service Type",
          services.filter((s) => s._id === service.service_type)[0].title
        )}
        {flexRowItem("Customer Type", customer_type, {
          textTransform: "capitalize",
        })}
        {flexRowItem("Penalty Charge", `ZMW${toFixed(penalty_charge)}`)}
        {flexRowItem("Fee Charge", `ZMW${toFixed(fee_charge)}`)}
        {flexRowItem(
          "Total Charge",
          `ZMW${toFixed(total_charge || penalty_charge + fee_charge)}`
        )}
      </View>
    </View>
  );
};

const mapPropsToState = ({ services }: RootReducerI) => ({
  services,
});

export default connect(mapPropsToState)(ServiceComponent);

const styles = StyleSheet.create({
  hightlightStyle: {
    borderRadius: 5,
    display: "flex",
    flexDirection: "column",
    flex: 1,
    padding: 10,
    margin: 5,
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
  itemContainer: {},
  itemStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    marginBottom: 2,
  },
  itemTitle: {
    fontWeight: "bold",
    color: "#0009",
  },
  textStyle: {
    marginLeft: 10,
    fontSize: 15,
    color: `${Colors.LwscBlack}bb`,
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
});
