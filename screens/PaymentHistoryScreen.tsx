import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Modal, Alert } from "react-native";
import { AccountI, Account } from "../models/account";
import { PropertyI } from "../models/meter-reading";
import { ActivityIndicator, List, Divider } from "react-native-paper";
import Colors from "../constants/Colors";
import { fetchPaymentHistory } from "../models/axios";
import { IdentityType } from "../types/identity-type";
import { useNavigation } from "@react-navigation/native";
import Strings from "../constants/Strings";
import { StatementI, Statement } from "../models/statement";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";

interface PropI {
  route: { params: { identity: AccountI | PropertyI } };
}

const PaymentHistoryScreen = ({ route }: PropI) => {
  const navigator = useNavigation();
  const { identity } = route.params;
  const isAccount = identity instanceof Account;
  const { container } = styles;
  const [loading, setLoading] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<StatementI[]>([]);

  useEffect(() => {
    let is_subscribed = true;

    if (is_subscribed && identity) {
      getPaymentHistory();
    }

    return () => {
      is_subscribed = false;
    };
  }, []);

  const renderListItem = ({ item }: { item: StatementI }) => {
    //   const desc =c
    // console.log(item);
    return (
      <>
        <List.Item
          style={{ backgroundColor: "white" }}
          onPress={() => {}}
          title="Ttile"
          description="Description"
          left={(props) => (
            <List.Icon
              {...props}
              icon={() => (
                <MaterialCommunityIcons
                  size={34}
                  color={Colors.gray3AColor}
                  name="home-city-outline"
                />
              )}
            />
          )}
        />
        <Divider />
      </>
    );
  };

  const getPaymentHistory = async () => {
    setLoading(true);

    let id = "";
    let type = IdentityType.Account;

    if (identity instanceof Account) {
      id = identity.CUSTKEY;
    } else {
      id = (identity as PropertyI).MeterNumber;
      type = IdentityType.Meter;
    }

    fetchPaymentHistory(id, type)
      .then(({ status, data }) => {
        if (status === 200 && data.success) {
          // console.log(data.payload);
          setPaymentHistory(data.payload.map((item) => new Statement(item)));
        } else {
          Alert.alert(
            "Unsuccessful",
            "Failed to fetch Payment History. Please try again.",
            [
              {
                text: "Cancel",
                onPress: () => navigator.navigate(Strings.HomeTabNavigator),
              },
              {
                text: "Retry",
                onPress: getPaymentHistory,
              },
            ]
          );
        }
      })
      .catch((err) => {
        const { title, message } = Strings.SELF_REPORTING_PROBLEM;
        Alert.alert(title, message, [
          { onPress: () => navigator.navigate(Strings.HomeTabNavigator) },
        ]);
      })
      .finally(() => setLoading(false));
  };

  return (
    <View style={container}>
      <Modal animationType="slide" transparent visible={loading}>
        <View style={[styles.centeredView, { backgroundColor: "#00000077" }]}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large" color={Colors.LwscOrange} />
          </View>
        </View>
      </Modal>
      {paymentHistory.length ? (
        <FlatList
          removeClippedSubviews={true}
          maxToRenderPerBatch={20}
          initialNumToRender={20}
          data={paymentHistory}
          keyExtractor={(item: StatementI) =>
            Math.random().toString(36).substring(10)
          }
          renderItem={renderListItem}
        />
      ) : (
        <Text style={{ margin: 15 }}>{`You have not made any payments on this ${
          isAccount ? "Account" : "Meter"
        } yet.`}</Text>
      )}
    </View>
  );
};

export default PaymentHistoryScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
