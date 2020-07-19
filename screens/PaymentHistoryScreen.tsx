import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, TouchableHighlight } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { RootReducerI } from "../redux/reducers";
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons";
import {
  Divider,
  ActivityIndicator,
  Appbar,
  Portal,
  Dialog,
  RadioButton,
  TextInput,
  Button,
} from "react-native-paper";
import Colors from "../constants/Colors";
import { bindActionCreators } from "redux";
import { setPaymentHistory } from "../redux/actions/payment-history";
import { fetchPaymentHistory } from "../models/axios";
import { AccountReducerI } from "../redux/reducers/accounts";
import Strings from "../constants/Strings";
import { useNavigation } from "@react-navigation/native";
import { IdentityType } from "../types/identity-type";
import { StatementI } from "../models/statement";

interface PaymentHistoryScreenI {
  paymentHistory: StatementI[];
  accounts: AccountReducerI;
  setPaymentHistory(history: StatementI[]): void;
}

function Item({
  init_trans_success,
  confirm_trans_success,
  _id,
  transaction_id,
  customer_type,
  account_number,
  meter_number,
  naration,
  first_name,
  last_name,
  amount,
  phone_number,
  email,
  bill_group,
  value_date,
  created_on,
  payment_channel,
  init_trans_response,
}: StatementI) {
  return (
    <React.Fragment>
      <TouchableHighlight
        underlayColor="#55555539"
        onPress={() => {
          // Alert.alert(payment_type, payment_description);
        }}
        style={{
          padding: 10,
          backgroundColor: "#fcfcfc",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        >
          <SimpleLineIcons name="clock" size={25} />
          <View style={{ paddingHorizontal: 10 }}>
            <Text
              style={{
                textTransform: "capitalize",
                fontWeight: "bold",
                color: `${Colors.LwscBlack}bb`,
              }}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {payment_channel}
            </Text>
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={{ color: `${Colors.LwscBlackLighter}` }}
            >
              {created_on.toLocaleString()}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
      <Divider style={{ marginVertical: 0 }} />
    </React.Fragment>
  );
}

const PaymentHistoryScreen = ({
  paymentHistory,
  accounts,
  setPaymentHistory,
}: PaymentHistoryScreenI) => {
  const { container, radioLabelStyle, flexRow } = styles;
  const accountKeys = Object.keys(accounts);
  const navigator = useNavigation();
  const [loading, setLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(
    accountKeys.length ? accounts[accountKeys[0]] : null
  );
  const [showDialog, setShowDialog] = useState(false);
  const [type, setType] = useState(IdentityType.Account);
  const [identity, setIdentity] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  // console.log(accounts)

  useEffect(() => {
    let is_subscribed = true;

    if (is_subscribed) {
      setLoading(true);
      fetchPaymentHistory("", IdentityType.Account)
        .then(({ status, data }) => {
          if (status === 200 && data.success) {
            setPaymentHistory(data.payload);
          } else {
            Alert.alert(
              Strings.SELF_REPORTING_PROBLEM.title,
              Strings.SELF_REPORTING_PROBLEM.message,
              [
                {
                  text: "OK",
                  onPress: () => navigator.navigate(Strings.HomeScreen),
                },
              ]
            );
          }
        })
        .catch((err) => {
          Alert.alert(
            Strings.SELF_REPORTING_PROBLEM.title,
            Strings.SELF_REPORTING_PROBLEM.message,
            [
              {
                text: "OK",
                onPress: () => navigator.navigate(Strings.HomeScreen),
              },
            ]
          );
        })
        .finally(() => setLoading(false));
    }

    return () => {
      is_subscribed = false;
    };
  }, []);

  const handleSubmitIdentity = () => {};

  return (
    <SafeAreaView style={container}>
      {selectedAccount && (
        <Appbar style={{}}>
          <Appbar.Content
            title={selectedAccount.CUSTKEY}
            subtitle={selectedAccount.FULL_NAME}
          />
          <Appbar.Action
            icon={() => (
              <Ionicons
                name={`${
                  Platform.OS === "ios" ? "ios" : "md"
                }-add-circle-outline`}
                size={25}
                color="white"
              />
            )}
            style={{
              alignSelf: "flex-end",
              position: "absolute",
              right: 40,
              top: 5,
            }}
            onPress={() => setShowDialog(true)}
          />
          <Appbar.Action
            icon={`dots-${Platform.OS === "ios" ? "horizontal" : "vertical"}`}
            style={{
              alignSelf: "flex-end",
              position: "absolute",
              right: 0,
              top: 5,
            }}
            onPress={() => {}}
          />
        </Appbar>
      )}

      
      <Portal>
        <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
          <Dialog.Title
            style={{ textTransform: "capitalize" }}
          >{`Add ${IdentityType[type]}`}</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              onValueChange={(value) => setType(value as IdentityType)}
              value={type}
            >
              <View style={flexRow}>
                <View style={flexRow}>
                  <Text style={radioLabelStyle}>Account</Text>
                  <RadioButton color="#3366cc" value={IdentityType.Account} />
                </View>
                <View style={flexRow}>
                  <Text style={radioLabelStyle}>Meter</Text>
                  <RadioButton color="#3366cc" value={IdentityType.Meter} />
                </View>
              </View>
            </RadioButton.Group>
            <TextInput
              mode="outlined"
              label={`${IdentityType[type]} Number`}
              keyboardType="number-pad"
              value={identity}
              disabled={loading}
              autoFocus={true}
              onChangeText={(text) => setIdentity(text.trim())}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button loading={loading} onPress={() => handleSubmitIdentity()}>
              Submit
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {loading ? (
        <ActivityIndicator
          size={50}
          color={Colors.colorGreen}
          style={{ alignSelf: "center", marginTop: 20 }}
        />
      ) : paymentHistory.length ? (
        <FlatList
          data={paymentHistory}
          renderItem={({ item }) => Item(item)}
          keyExtractor={(item) => item._id}
        />
      ) : (
        <Text style={{ margin: 10, color: `${Colors.LwscBlack}bb` }}>
          You have not made any payments thus far.
        </Text>
      )}
    </SafeAreaView>
  );
};

const mapStateToProps = ({ paymentHistory, accounts }: RootReducerI) => ({
  paymentHistory,
  accounts,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      setPaymentHistory,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentHistoryScreen);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "#fff",
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  radioLabelStyle: {
    fontSize: 16,
  },
});
