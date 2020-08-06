import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Statement } from "../models/statement";
import { Title, Divider, Subheading, Caption } from "react-native-paper";
import Colors from "../constants/Colors";
import { PaymentChannelC } from "../types/payment-channel";
import { toFixed } from "../helpers/functions";
import { ScrollView } from "react-native-gesture-handler";

interface PropI {
  route: { params: { statement: string } };
}

const PaymentStatementScreen = ({ route }: PropI) => {
  const { container, heading, flexRow, value, pheading, flexWrap } = styles;
  const { statement } = route.params;
  const {
    confirm_trans_success,
    transaction_id,
    customer_type,
    account_number,
    meter_number,
    naration,
    amount,
    phone_number,
    email,
    created_on,
    payment_channel,
    init_trans_response,
    fullName,
    gen_token_response,
  } = new Statement(JSON.parse(statement));
  //   console.log(gen_token_response);
  return (
    <ScrollView
      style={[
        container,
        { backgroundColor: confirm_trans_success ? "#00bb2710" : "#ff000010" },
      ]}
    >
      <View style={flexRow}>
        <Subheading style={heading}>Date</Subheading>
        <Subheading
          style={value}
        >{`${created_on.toLocaleString()}`}</Subheading>
      </View>
      <Divider
        style={{
          marginVertical: 5,
          backgroundColor: confirm_trans_success
            ? "#00bb27"
            : Colors.errorColor,
        }}
      />
      <Subheading style={heading}>Order #</Subheading>
      <Subheading style={value}>{transaction_id}</Subheading>
      <Divider
        style={{
          marginVertical: 5,
          backgroundColor: confirm_trans_success
            ? "#00bb27"
            : Colors.errorColor,
        }}
      />
      <Caption style={{ fontSize: 12.5, color: "#444" }}>{naration}</Caption>
      {amount && (
        <>
          <Divider
            style={{
              marginVertical: 5,
              backgroundColor: confirm_trans_success
                ? "#00bb27"
                : Colors.errorColor,
            }}
          />
          <Title>Amount</Title>
          <View style={flexRow}>
            <Subheading style={flexWrap}>{`ZMW ${toFixed(amount)}`}</Subheading>
          </View>
        </>
      )}
      {gen_token_response && gen_token_response.success && (
        <>
          <Divider
            style={{
              marginVertical: 5,
              backgroundColor: confirm_trans_success
                ? "#00bb27"
                : Colors.errorColor,
            }}
          />
          <Title>Token</Title>
          <View style={flexRow}>
            <Subheading style={{ ...flexWrap, fontWeight: "bold" }}>
              {gen_token_response.payload.token}
            </Subheading>
          </View>
        </>
      )}
      <Divider
        style={{
          marginVertical: 5,
          backgroundColor: confirm_trans_success
            ? "#00bb27"
            : Colors.errorColor,
        }}
      />
      <Title>Billing Information</Title>
      <View style={flexRow}>
        <Subheading style={heading}>Name</Subheading>
        <Subheading style={value}>{fullName}</Subheading>
      </View>
      {phone_number && (
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
      </View>
      <Divider
        style={{
          marginVertical: 5,
          backgroundColor: confirm_trans_success
            ? "#00bb27"
            : Colors.errorColor,
        }}
      />
      <Title>Payment Details</Title>
      <View style={flexRow}>
        <Subheading style={pheading}>Amount</Subheading>
        <Subheading style={value}>{`ZMW ${toFixed(amount)}`}</Subheading>
      </View>
      <View style={flexRow}>
        <Subheading style={pheading}>Channel</Subheading>
        <Subheading style={value}>
          {payment_channel instanceof PaymentChannelC
            ? payment_channel.title
            : payment_channel}
        </Subheading>
      </View>
      <View style={flexRow}>
        <Subheading style={pheading}>Status</Subheading>
        <Subheading style={value}>
          {confirm_trans_success ? "Succeeded" : "Failed"}
        </Subheading>
      </View>
      <View style={flexRow}>
        <Subheading style={pheading}>Response</Subheading>
        <Subheading style={flexWrap}>{init_trans_response.message}</Subheading>
      </View>
    </ScrollView>
  );
};

//{`${created_on.toDateString()}, ${created_on.toLocaleTimeString()} hours`}
export default PaymentStatementScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    padding: 15,
    paddingBottom: 30,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 15,
    width: 110,
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
