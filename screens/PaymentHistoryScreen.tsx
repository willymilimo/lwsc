import React from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, TouchableHighlight } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { RootReducerI } from "../redux/reducers";
import { PaymentHistoryI } from "../models/payment-history";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Divider } from "react-native-paper";
import Colors from "../constants/Colors";

interface PaymentHistoryScreenI {
  paymentHistory: PaymentHistoryI[];
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

const PaymentHistoryScreen = ({ paymentHistory }: PaymentHistoryScreenI) => {
  const { container } = styles;
  return (
    <SafeAreaView style={container}>
      {paymentHistory.length ? (
        <FlatList
          data={paymentHistory}
          renderItem={({ item }) => Item(item)}
          keyExtractor={(item) => item._id}
        />
      ) : (
        <Text style={{ margin: 10, color: `${Colors.LwscBlack}bb` }}>
          You have not made any payments for far.
        </Text>
      )}
    </SafeAreaView>
  );
};

const mapStateToProps = ({ paymentHistory }: RootReducerI) => ({
  paymentHistory,
});

export default connect(mapStateToProps)(PaymentHistoryScreen);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "#fff",
  },
});
