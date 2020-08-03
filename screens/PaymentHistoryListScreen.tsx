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
  route: { params: { isConsumption: boolean } };
  accounts: AccountReducerI;
}

const PaymentHistoryListScreen = ({
  accounts,
  route,
}: PaymentHistoryScreenI) => {
  const { box, missingAccount, maText } = styles;
  const navigator = useNavigation();
  const { isConsumption } = route.params;

  const payItems = Object.values(accounts);
  console.log(payItems);
  return (
    <View style={styles.container}>
      <ScrollView style={box}>
        {payItems.length ? ( // 41130324183  03008164
          payItems.map((acc) => (
            <BillComponent
              key={Math.random().toString(36).substring(10)}
              account={acc}
              onPress={() =>
                navigator.navigate(
                  isConsumption
                    ? Strings.ConsumptionScreen
                    : Strings.PaymentHistoryScreen,
                  {
                    identity: acc,
                  }
                )
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
              onPress={() =>
                navigator.navigate(Strings.HomeTabNavigator, {
                  screen: "Accounts",
                  showAddDialog: true,
                })
              }
            >
              Add Account/Meter
            </Button>
          </View>
        )}
      </ScrollView>
      <LwscFAB
        visible={true}
        onPress={() =>
          navigator.navigate(Strings.HomeTabNavigator, {
            screen: "Accounts",
            showAddDialog: true,
          })
        }
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
