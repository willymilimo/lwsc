import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { setBillGroups } from "../redux/actions/bill-groups";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RootReducerI } from "../redux/reducers";
import { BillGroupReducerI } from "../redux/reducers/bill-groups";
import { fetchAllBillGroups, validateBillWindow } from "../models/axios";
import { BillGroupI } from "../models/meter-reading";
import {
  ActivityIndicator,
  List,
  Portal,
  Provider,
  Modal,
  Button,
} from "react-native-paper";
import Colors from "../constants/Colors";
import { FlatList } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Strings from "../constants/Strings";

interface PropsI {
  billGroups: BillGroupReducerI;
  setBillGroups(billGroups: BillGroupReducerI): void;
}

const BillGroupScreen = ({ billGroups, setBillGroups }: PropsI) => {
  const navigator = useNavigation();
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
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

  const validate = async (billGroup: string) => {
    try {
      const { status, data } = await validateBillWindow(billGroup);
      // console.log(data);
      if (status === 200 && data.success) {
        return data.payload.CYCLE_ID;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const renderListItem = ({ item }: { item: BillGroupI }) => (
    <List.Item
      onPress={async () => {
        setModalMessage("Validating billing window");
        setLoading(true);
        const cycle_id = await validate(item.GROUP_ID);
        setLoading(false);
        setModalMessage("");
        if (cycle_id) {
          navigator.navigate(Strings.BookNumbersScreen, {
            billGroup: item,
            cycle_id,
          });
        } else {
          const { title, message } = Strings.BILLING_CYCLE;
          Alert.alert(title, message);
        }
      }}
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
    // console.log("windows......");
    setModalMessage("Loading bill groups");
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
      .finally(() => {
        setLoading(false);
      });
  };

  // console.log(Object.keys(billGroups).length)
  return (
    <>
      <View style={styles.container}>
        {!Object.keys(billGroups).length &&
        modalMessage == "Loading bill groups" ? (
          <Text>
            Unable to fetch bill groups. Please ensure you are connected to the
            internet.
          </Text>
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
      <Provider>
        <Portal>
          <Modal visible={loading}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <ActivityIndicator size="large" color={Colors.LwscOrange} />
                <Text
                  style={{
                    marginTop: 20,
                    textAlign: "center",
                  }}
                >
                  {modalMessage}
                </Text>
                <Text
                  style={{
                    marginTop: 20,
                    textAlign: "center",
                  }}
                >{`Please wait...`}</Text>
              </View>
            </View>
          </Modal>
          {/* <Button style={{ marginTop: 30 }} onPress={() => setLoading(true)}>
            Show
          </Button> */}
        </Portal>
      </Provider>
    </>
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
