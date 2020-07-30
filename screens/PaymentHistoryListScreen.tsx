import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootReducerI } from "../redux/reducers";
import { AccountReducerI } from "../redux/reducers/accounts";
import { connect } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "react-native-paper";
import Strings from "../constants/Strings";
import BillComponent from "../components/BillComponent";
import Colors from "../constants/Colors";
import LwscFAB from "../components/LwscFAB";
import { Ionicons } from "@expo/vector-icons";

interface PaymentHistoryScreenI {
  accounts: AccountReducerI;
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

const PaymentHistoryListScreen = ({ accounts }: PaymentHistoryScreenI) => {
  const { box, missingAccount, maText } = styles;
  const navigator = useNavigation();

  const payItems = Object.values(accounts);
  return (
    <View style={styles.container}>
      <ScrollView style={box}>
        {payItems.length ? (
          payItems.map((acc) => (
            <BillComponent
              key={Math.random().toString(36).substring(10)}
              account={acc}
              onPress={() =>
                navigator.navigate(Strings.PaymentHistoryScreen, {
                  identity: acc,
                })
              }
            />
          ))
        ) : (
          <View style={missingAccount}>
            <Text style={maText}>
              You have not added any account/meter to your profile
            </Text>
            <Button
              style={{ marginTop: 15 }}
              contentStyle={{
                borderColor: Colors.linkBlue,
                borderWidth: 0.75,
                borderRadius: 5,
                backgroundColor: `${Colors.linkBlue}22`,
              }}
              color={`${Colors.LwscBlue}bb`}
              //   loading={loading}
              //   icon="send"
              mode="outlined"
              onPress={() => {}}
            >
              Add Account/Meter
            </Button>
          </View>
        )}
      </ScrollView>
      <LwscFAB
        visible={true}
        onPress={() => navigator.navigate(Strings.HomeTabNavigator, {screen: "Accounts"})}
        label="Add Account/Meter"
        labelStyle={{ width: 145 }}
        icon={{
          name: `${Platform.OS === "ios" ? "ios" : "md"}-add`,
          type: Ionicons,
        }}
        backgroundColor={Colors.LwscBlue}
        color="white"
      />
    </View>
  );
};

const mapStateToProps = ({ accounts }: RootReducerI) => ({
  accounts,
});

export default connect(mapStateToProps)(PaymentHistoryListScreen);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
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
  box: {
    display: "flex",
    flex: 1,
    padding: 15,
  },
  formBox: {
    backgroundColor: "red",
    display: "flex",
    flex: 1,
    height: 100,
    width: 100,
  },
  missingAccount: {
    // backgroundColor: 'pink'
  },
  maText: {
    marginBottom: 10,
  },
});
