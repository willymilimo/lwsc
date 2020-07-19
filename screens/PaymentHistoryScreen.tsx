import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, TouchableHighlight } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { RootReducerI } from "../redux/reducers";
import { PaymentHistoryI } from "../models/payment-history";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Divider, ActivityIndicator } from "react-native-paper";
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
  navigation: any;
  setPaymentHistory(history: StatementI[]): void;
}

function Item({
  payment_date,
  payment_type,
  payment_description,
  amount,
}: PaymentHistoryI) {
  return (
    <React.Fragment>
      <TouchableHighlight
        underlayColor="#55555539"
        onPress={() => {
          Alert.alert(payment_type, payment_description);
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
              {payment_type}
            </Text>
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={{ color: `${Colors.LwscBlackLighter}` }}
            >
              {payment_date.toLocaleString()}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
      <Divider style={{ marginVertical: 0 }} />
    </React.Fragment>
  );
}

// const PaymentHistoryScreen = ({
//   paymentHistory,
//   accounts,
//   setPaymentHistory,
// }: PaymentHistoryScreenI) => {

//   useEffect(() => {
//     let is_subscribed = true;

//     if (is_subscribed) {
//       setLoading(true);
//       fetchPaymentHistory("", AddType.account)
//         .then(({ status, data }) => {
// if (status === 200 && data.success) {
//   setPaymentHistory(data.payload);
// } else {
//   Alert.alert(
//     Strings.SELF_REPORTING_PROBLEM.title,
//     Strings.SELF_REPORTING_PROBLEM.message,
//     [
//       {
//         text: "OK",
//         onPress: () => navigator.navigate(Strings.HomeScreen),
//       },
//     ]
//   );
// }
//         })
//         .catch((err) => {
//           Alert.alert(
//             Strings.SELF_REPORTING_PROBLEM.title,
//             Strings.SELF_REPORTING_PROBLEM.message,
//             [
//               {
//                 text: "OK",
//                 onPress: () => navigator.navigate(Strings.HomeScreen),
//               },
//             ]
//           );
//         })
//         .finally(() => setLoading(false));
//     }

//     return () => {
//       is_subscribed = false;
//     };
//   }, []);

// };

export class PaymentHistoryScreen extends React.Component<
  PaymentHistoryScreenI,
  any
> {
  constructor(prop: PaymentHistoryScreenI) {
    super(prop);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    this.fetchPaymentHistory();
  }

  async fetchPaymentHistory() {
    this.setState({ loading: true });
    try {
      const { status, data } = await fetchPaymentHistory("", IdentityType.Account);
      if (status === 200 && data.success) {
        // setPaymentHistory(data.payload);

      } else {
        Alert.alert(
          Strings.SELF_REPORTING_PROBLEM.title,
          Strings.SELF_REPORTING_PROBLEM.message,
          [
            {
              text: "OK",
              onPress: () => this.props.navigation.navigate(Strings.HomeScreen),
            },
          ]
        );
      }
    } catch (err) {
      Alert.alert(
        Strings.SELF_REPORTING_PROBLEM.title,
        Strings.SELF_REPORTING_PROBLEM.message,
        [
          {
            text: "OK",
            onPress: () => this.props.navigation.navigate(Strings.HomeScreen),
          },
        ]
      );
    }
    this.setState({ loading: false });
  }

  render() {
    const { container } = styles;
    const { loading } = this.state;
    const { paymentHistory, accounts } = this.props;
    return (
      <SafeAreaView style={container}>
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
  }
}

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
});
