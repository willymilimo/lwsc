import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Modal, Alert } from "react-native";
import { AccountI, Account } from "../models/account";
import { PropertyI } from "../models/meter-reading";
import {
  ActivityIndicator,
  List,
  Divider,
  Searchbar,
} from "react-native-paper";
import Colors from "../constants/Colors";
import { fetchPaymentHistory } from "../models/axios";
import { IdentityType } from "../types/identity-type";
import { useNavigation } from "@react-navigation/native";
import Strings from "../constants/Strings";
import { StatementI, Statement } from "../models/statement";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";

interface PropI {
  route: { params: { identity: AccountI | PropertyI | string } };
}

const PaymentHistoryScreen = ({ route }: PropI) => {
  const navigator = useNavigation();
  const { identity } = route.params;
  const isAccount = identity instanceof Account;
  const { container } = styles;
  const [loading, setLoading] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<StatementI[]>([]);
  const [filteredDisplayList, setFilteredDisplayList] = useState<StatementI[]>(
    []
  );
  const [searchQuery, setSearchQuery] = React.useState("");

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 1) {
      query = query.toLocaleLowerCase();
      const filtered = paymentHistory.filter(
        (bn) =>
          bn.naration.toLocaleLowerCase().indexOf(query) !== -1 ||
          bn.created_on.toDateString().indexOf(query) !== -1 ||
          JSON.stringify(bn.payment_channel).indexOf(query) !== -1
      );
      // console.log(filtered.length);
      setFilteredDisplayList(filtered);
    } else {
      setFilteredDisplayList([]);
    }
  };

  useEffect(() => {
    let is_subscribed = true;

    if (is_subscribed && identity) {
      getPaymentHistory();
    }

    return () => {
      is_subscribed = false;
    };
  }, [identity]);

  const renderListItem = ({ item }: { item: StatementI }) => {
    const { confirm_trans_success, naration, created_on } = item;
    return (
      <>
        <List.Item
          style={{
            backgroundColor: confirm_trans_success ? "#00bb2710" : "#ff000010",
          }}
          onPress={() =>
            navigator.navigate(Strings.PaymentStatementScreen, {
              statement: JSON.stringify(item),
            })
          }
          title={naration}
          description={created_on.toDateString()}
          left={(props) => (
            <List.Icon
              {...props}
              icon={() => (
                <MaterialCommunityIcons
                  size={34}
                  color={confirm_trans_success ? "#00bb27" : Colors.errorColor}
                  name="history"
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
    } else if (typeof identity === "string") {
      id = identity;
      type = IdentityType.Meter;
    } else {
      id = (identity as PropertyI).MeterNumber;
      type = IdentityType.Meter;
    }

    fetchPaymentHistory(id, type)
      .then(({ status, data }) => {
        // console.log(data);
        if (status === 200 && data.success) {
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
        console.log(err);
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

      <Searchbar
        placeholder={`Search History`}
        onChangeText={onChangeSearch}
        value={searchQuery}
      />

      {paymentHistory.length ? (
        <FlatList
          removeClippedSubviews={true}
          maxToRenderPerBatch={20}
          initialNumToRender={20}
          data={
            filteredDisplayList.length ? filteredDisplayList : paymentHistory
          }
          keyExtractor={({ _id }: StatementI) => _id}
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
