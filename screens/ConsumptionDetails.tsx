import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ConsumptionI } from "../models/consumption";
import { ScrollView } from "react-native-gesture-handler";
import { Subheading, Divider, Title, Caption } from "react-native-paper";
import { toFixed } from "../helpers/functions";

interface PropI {
  route: { params: { item: ConsumptionI } };
}

export default function ConsumptionDetails({ route }: PropI) {
  const { container, heading, flexRow, value, pheading, flexWrap } = styles;
  const { item } = route.params;
  const {
    custkey,
    BILNG_DATE,
    DESCRIPTION,
    TRNS_TYPE,
    TRNS_STYPE,
    DATE_FROM,
    DATE_TO,
    PR_READING,
    CR_READING,
    CONSUMP,
    AMOUNT,
    BILL_CYCLE_ID,
    billingDate,
    dateFrom,
    dateTo,
  } = item;
  return (
    <ScrollView style={container}>
      <View style={flexRow}>
        <Subheading style={heading}>Billing Date</Subheading>
        <Subheading style={value}>{billingDate.toLocaleString()}</Subheading>
      </View>
      <Divider
        style={{
          marginVertical: 5,
        }}
      />
      <Caption style={{ fontSize: 12.5, color: "#444" }}>{item[""]}</Caption>
      <Divider
        style={{
          marginVertical: 5,
        }}
      />
      {DESCRIPTION && (
        <>
          <Caption style={{ fontSize: 12.5, color: "#444" }}>
            {DESCRIPTION}
          </Caption>
          <Divider
            style={{
              marginVertical: 5,
            }}
          />
        </>
      )}
      <Title>Consumption Information</Title>
      <View style={flexRow}>
        <Subheading style={heading}>Account #</Subheading>
        <Subheading style={value}>{custkey}</Subheading>
      </View>
      {DATE_FROM && (
        <View style={flexRow}>
          <Subheading style={heading}>Date From</Subheading>
          <Subheading style={value}>{dateFrom.toLocaleString()}</Subheading>
        </View>
      )}
      {DATE_TO && (
        <View style={flexRow}>
          <Subheading style={heading}>Date To</Subheading>
          <Subheading style={value}>{dateTo.toLocaleString()}</Subheading>
        </View>
      )}
      {PR_READING !== null && (
        <View style={flexRow}>
          <Subheading style={heading}>Previous Reading</Subheading>
          <Subheading style={value}>{PR_READING}</Subheading>
        </View>
      )}
      {CR_READING !== null && (
        <View style={flexRow}>
          <Subheading style={heading}>Current Reading</Subheading>
          <Subheading style={value}>{CR_READING}</Subheading>
        </View>
      )}
      {CONSUMP !== null && (
        <View style={flexRow}>
          <Subheading style={heading}>Consumption</Subheading>
          <Subheading style={value}>{CONSUMP}</Subheading>
        </View>
      )}
      {AMOUNT && (
        <View style={flexRow}>
          <Subheading style={heading}>Amount</Subheading>
          <Subheading style={value}>{`ZMW ${toFixed(AMOUNT)}`}</Subheading>
        </View>
      )}
      {/*{phone_number && (
        <View style={flexRow}>
          <Subheading style={heading}>Phone</Subheading>
          <Subheading style={value}>{phone_number}</Subheading>
        </View>
      )}
      {email && (
        <View style={flexRow}>
          <Subheading style={heading}>Email</Subheading>
          <Subheading style={value}>{email}</Subheading>
        </View>
      )}
      {meter_number && (
        <View style={flexRow}>
          <Subheading style={heading}>Meter #</Subheading>
          <Subheading style={value}>{meter_number}</Subheading>
        </View>
      )}
      {account_number && (
        <View style={flexRow}>
          <Subheading style={heading}>Account #</Subheading>
          <Subheading style={value}>{account_number}</Subheading>
        </View>
      )}
      <View style={flexRow}>
        <Subheading style={heading}>Type</Subheading>
        <Subheading style={[value, { textTransform: "capitalize" }]}>
          {customer_type}
        </Subheading>
      </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    padding: 15,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 15,
    width: 150,
  },
  pheading: {
    fontWeight: "bold",
    fontSize: 15,
    width: 90,
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
  },
  value: {
    fontSize: 12,
  },
  flexWrap: {
    flex: 1,
    flexWrap: "wrap",
    fontSize: 12,
  },
});