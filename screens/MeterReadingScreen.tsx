import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import Colors from "../constants/Colors";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Strings from "../constants/Strings";
import {
  fetchAllBillGroups,
  fetchAllBookNumbers,
  fetchAllCustomerDetailsByBillGroup,
} from "../models/axios";
import { connect } from "react-redux";
import { RootReducerI } from "../redux/reducers";
import { bindActionCreators } from "redux";
import { setBillGroups } from "../redux/actions/bill-groups";
import { setBookNumbers } from "../redux/actions/book-numbers";
import { setMRProperties } from "../redux/actions/meter-reading-properties";
import { BillGroupReducerI } from "../redux/reducers/bill-groups";
import { BookNumberReducerI } from "../redux/reducers/book-number";
import { MeterReadingPropertiesReducerI } from "../redux/reducers/meter-reading-proerties";

interface PropsI {
  billGroups: BillGroupReducerI;
  bookNumbers: BookNumberReducerI;
  properties: MeterReadingPropertiesReducerI;
  setBillGroups(billGroups: BillGroupReducerI): void;
  setBookNumbers(bookNumbers: BookNumberReducerI): void;
  setMRProperties(properties: MeterReadingPropertiesReducerI): void;
}

const MeterReadingScreen = ({
  billGroups,
  bookNumbers,
  properties,
  setBillGroups,
  setBookNumbers,
  setMRProperties,
}: PropsI) => {
  const navigator = useNavigation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let is_subscribed = true;

    if (is_subscribed) {
    }

    return () => {
      is_subscribed = false;
    };
  }, []);

  const fetchBillGroups = async (): Promise<BillGroupReducerI> => {
    const pay: BillGroupReducerI = {};
    const { data } = await fetchAllBillGroups();
    const { success, payload } = data;
    if (success) {
      payload.recordset.forEach((bg) => (pay[bg.GROUP_ID] = bg));
      setBillGroups(pay);
    }

    return pay;
  };

  const fetchBookNumbers = async (): Promise<BookNumberReducerI> => {
    const pay: BookNumberReducerI = {};
    const { data } = await fetchAllBookNumbers();
    const { success, payload } = data;
    if (success) {
      payload.recordset.forEach((bg) => {
        const items = pay[bg.BILLGROUP];
        pay[bg.BILLGROUP] = [...items, bg];
      });
      setBookNumbers(pay);
    }

    return pay;
  };

  const fetchProperties = async () => {};

  const bootstrap = async () => {
    setLoading(true);
    try {
      await fetchBillGroups();
      await fetchBookNumbers();
      await fetchProperties();
    } catch (err) {
      Alert.alert(
        Strings.SELF_REPORTING_PROBLEM.title,
        Strings.SELF_REPORTING_PROBLEM.message,
        [{ onPress: () => navigator.navigate(Strings.HomeTabNavigator) }]
      );
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Button
        style={{ marginTop: 15 }}
        contentStyle={{
          borderColor: Colors.linkBlue,
          borderWidth: 0.75,
          borderRadius: 5,
          backgroundColor: `${Colors.linkBlue}22`,
        }}
        color={`${Colors.LwscBlue}bb`}
        mode="outlined"
        onPress={() => navigator.navigate(Strings.ReadMeterScreen)}
      >
        Read my Meter
      </Button>
      <Button
        style={{ marginTop: 15 }}
        contentStyle={{
          borderColor: Colors.linkBlue,
          borderWidth: 0.75,
          borderRadius: 5,
          backgroundColor: `${Colors.linkBlue}22`,
        }}
        color={`${Colors.LwscBlue}bb`}
        mode="outlined"
        onPress={() => navigator.navigate(Strings.LwscStaffAuthScreen)}
      >
        LWSC STAFF
      </Button>
    </View>
  );
};

const mapPropsToState = ({
  billGroups,
  bookNumbers,
  properties,
}: RootReducerI) => ({ billGroups, bookNumbers, properties });

const matchDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      setBillGroups,
      setBookNumbers,
      setMRProperties,
    },
    dispatch
  );

export default connect(
  mapPropsToState,
  matchDispatchToProps
)(MeterReadingScreen);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
    paddingHorizontal: 15,
  },
});
