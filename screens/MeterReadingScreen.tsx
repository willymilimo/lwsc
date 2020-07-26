import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Alert, Modal } from "react-native";
import Colors from "../constants/Colors";
import { Button, ActivityIndicator, Searchbar, List } from "react-native-paper";
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
import {
  BookNumber,
  Property,
  BillGroupI,
  BookNumberI,
  PropertyI,
} from "../models/meter-reading";
import { FlatList } from "react-native-gesture-handler";
import { asyncForEach } from "../helpers/functions";
import { MaterialCommunityIcons } from "@expo/vector-icons";

enum ItemType {
  BillGroup,
  BookNumber,
  Property,
}

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
  const [loadingState, setLoadingState] = useState("bill groups");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [billGroup, setBillGroup] = useState<BillGroupI | null>(null);
  const [bookNumber, setBookNumber] = useState<BookNumberI | null>(null);
  const [property, setProperty] = useState<PropertyI>();
  const [displayList, setDisplayList] = useState<
    BillGroupI[] | BookNumberI[] | PropertyI[]
  >(Object.values(billGroups));
  const [filteredDisplayList, setFilteredDisplayList] = useState([]);

  const onChangeSearch = (query: string) => setSearchQuery(query);

  useEffect(() => {
    let is_subscribed = true;

    if (
      is_subscribed &&
      (!Object.keys(billGroups).length || !Object.keys(bookNumbers).length)
    ) {
      bootstrap();
    }

    return () => {
      is_subscribed = false;
    };
  }, []);

  function removeDuplicates<T>(array: T[]): T[] {
    return Array.from(new Set(array));
  }

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

  const fetchBookNumbers = async (): Promise<BookNumberI[]> => {
    setLoadingState("book numbers");
    const bns: { [key: string]: BookNumberI } = {};
    const { data } = await fetchAllBookNumbers();
    const { success, payload } = data;
    if (success) {
      const pay: BookNumberReducerI = {};
      payload.recordset.forEach((bg) => {
        bg = new BookNumber(bg);
        let items = pay[bg.key];

        if (!items) items = {};
        if (bg.key) {
          pay[bg.key] = { ...items, bg };
          bns[bg.key] = bg;
        }
      });

      setBookNumbers(pay);
    }

    return Object.values(bns);
  };

  const fetchProperties = async (bns: BookNumberI[]) => {
    const pay: MeterReadingPropertiesReducerI = {};

    await asyncForEach(bns, async (bn: BookNumberI) => {
      console.log(bn.BILLGROUP + " " + bn.CODE);
      setLoadingState(`${bn.DESCRIBE} properties`);

      const { data } = await fetchAllCustomerDetailsByBillGroup(bn);
      const { success, payload } = data;
      // console.log(data)
      if (success) {
        payload.recordset.forEach((p) => {
          p = new Property(p);
          let items = pay[p.key];
          if (!items) {
            items = [];
          }

          pay[p.key] = [...items, p];
        });

        Object.keys(pay).forEach((key) => {
          pay[key] = removeDuplicates<PropertyI>(pay[key]);
        });

        setMRProperties(pay);
      }
    });
  };

  const bootstrap = async () => {
    setLoading(true);
    try {
      await fetchBillGroups();
      const bns = await fetchBookNumbers();
      // await fetchProperties(bns);
    } catch (err) {
      Alert.alert(
        Strings.SELF_REPORTING_PROBLEM.title,
        Strings.SELF_REPORTING_PROBLEM.message
        // [{ onPress: () => navigator.navigate(Strings.HomeTabNavigator) }]
      );
    }
    setLoading(false);
  };

  const handleItemClick = (item: BillGroupI | BookNumberI | PropertyI) => {
    if (!billGroup) {
      item = item as BillGroupI;
      setBillGroup(item);
      console.log(bookNumbers)
      let bns = Object.values(bookNumbers[item.GROUP_ID]);
      setDisplayList(bns);
    } else if (!bookNumber) {
      item = item as BookNumberI;
      let bns = Object.values(bookNumbers[item.key]);
      setDisplayList(bns);
    // } else {
    //   item = item as PropertyI;
    //   let bns = Object.values(bookNumbers[item.key]);
    //   setDisplayList(bns);
    }
  };

  const renderListItem = ({
    item,
  }: {
    item: BillGroupI | BookNumberI | PropertyI;
  }) => {
    let title = null;
    let description = null;
    let icon = "home-group";

    if (item instanceof BookNumber) {
      title = item.DESCRIBE;
      description = `${item.CODE} - ${item.NO_WALKS} walks`;
      icon = "home-group";
    } else if (item instanceof Property) {
      title = `Meter #: ${item.MeterNumber}`;
      description =
        `${item.PLOT_NO} ${item.Customer_Address}`.trim() + ` ${item.Township}`;
      icon = "home-city-outline";
    } else {
      item = item as BillGroupI;
      title = item.GROUP_ID;
      description = item.DESCRIPTION;
    }

    return (
      <List.Item
        onPress={() => handleItemClick(item)}
        title={title}
        description={description}
        left={(props) => (
          <List.Icon
            {...props}
            icon={() => (
              <MaterialCommunityIcons
                size={34}
                color={Colors.gray3AColor}
                name={icon}
              />
            )}
          />
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Modal animationType="slide" transparent visible={loading}>
        <View style={[styles.centeredView, { backgroundColor: "#00000077" }]}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large" color={Colors.LwscOrange} />
            <Text
              style={{
                marginTop: 20,
                textAlign: "center",
              }}
            >{`Loading ${loadingState}...`}</Text>
            <Text
              style={{
                marginTop: 20,
                textAlign: "center",
              }}
            >{`Please wait...`}</Text>
          </View>
        </View>
      </Modal>
      <Searchbar
        placeholder={`Search ${
          !billGroup ? "Bill Group" : !bookNumber ? "Book Number" : "Property"
        }`}
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <FlatList
        removeClippedSubviews={true}
        maxToRenderPerBatch={20}
        initialNumToRender={20}
        data={filteredDisplayList.length ? filteredDisplayList : displayList}
        keyExtractor={(item: any) => item.key || item.GROUP_ID}
        renderItem={renderListItem}
      />
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
    // paddingHorizontal: 15,
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
