import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Modal, Alert } from "react-native";
import { setBillGroups } from "../redux/actions/bill-groups";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RootReducerI } from "../redux/reducers";
import { BillGroupReducerI } from "../redux/reducers/bill-groups";
import { fetchAllBillGroups } from "../models/axios";
import { BillGroupI } from "../models/meter-reading";
import { ActivityIndicator, List } from "react-native-paper";
import Colors from "../constants/Colors";
import { FlatList } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Strings from "../constants/Strings";

interface PropsI {
  billGroups: BillGroupReducerI;
  setBillGroups(billGroups: BillGroupReducerI): void;
  route: {
    params: { manNumber: string };
  };
}

const BillGroupScreen = ({ billGroups, setBillGroups, route }: PropsI) => {
  const navigator = useNavigation();
  const [loading, setLoading] = useState(false);
  const [displayList, setDisplayList] = useState<BillGroupI[]>(
    Object.values(billGroups)
  );

  useEffect(() => {
    let is_subscribed = true;

    if (is_subscribed && !Object.keys(billGroups).length) {
      fetchBillGroups();
    }

    return () => {
      is_subscribed = false;
    };
  }, []);

  const renderListItem = ({ item }: { item: BillGroupI }) => (
    <List.Item
      onPress={() =>
        navigator.navigate(Strings.BookNumbersScreen, {
          manNumber: route.params.manNumber,
          billGroup: item,
        })
      }
      title={item.GROUP_ID}
      description={item.DESCRIPTION}
      left={(props) => (
        <List.Icon
          {...props}
          icon={() => (
            <MaterialCommunityIcons
              size={34}
              color={Colors.gray3AColor}
              name="home-group"
            />
          )}
        />
      )}
    />
  );

  const fetchBillGroups = async () => {
    setLoading(true);
    fetchAllBillGroups()
      .then(({ status, data }) => {
        const { success, payload } = data;

        // console.log(status, data);

        if (status === 200 && success) {
          const pay: BillGroupReducerI = {};
          payload.recordset.forEach((bg) => (pay[bg.GROUP_ID] = bg));
          setBillGroups(pay);
          setDisplayList(Object.values(pay));
        } else {
          Alert.alert(
            "Load Failure",
            "Failed to load bill groups. Please try again later.",
            [
              {
                text: "Cancel",
                onPress: () => navigator.navigate(Strings.HomeTabNavigator),
              },
              { text: "RETRY", onPress: fetchBillGroups },
            ]
          );
        }
      })
      .catch((e) =>
        Alert.alert(
          Strings.SELF_REPORTING_PROBLEM.title,
          Strings.SELF_REPORTING_PROBLEM.message,
          [{ onPress: () => navigator.navigate(Strings.HomeTabNavigator) }]
        )
      )
      .finally(() => setLoading(false));
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={[styles.centeredView, { backgroundColor: "#00000077" }]}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large" color={Colors.LwscOrange} />
            <Text
              style={{
                marginTop: 20,
                textAlign: "center",
              }}
            >
              Loading bill groups
            </Text>
            <Text
              style={{
                marginTop: 20,
                textAlign: "center",
              }}
            >{`Please wait...`}</Text>
          </View>
        </View>
      ) : (
        <FlatList
          removeClippedSubviews={true}
          maxToRenderPerBatch={20}
          initialNumToRender={20}
          data={displayList}
          keyExtractor={(item: BillGroupI) => item.GROUP_ID}
          renderItem={renderListItem}
        />
      )}
    </View>
  );
};

const mapPropsToState = ({ billGroups }: RootReducerI) => ({ billGroups });

const matchDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      setBillGroups,
    },
    dispatch
  );

export default connect(mapPropsToState, matchDispatchToProps)(BillGroupScreen);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
    // paddingHorizontal: 15,
  },
  centeredView: {
    // flex: 1,
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
