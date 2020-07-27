import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Modal } from "react-native";
import { RootReducerI } from "../redux/reducers";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setMRProperties } from "../redux/actions/meter-reading-properties";
import { MeterReadingPropertiesReducerI } from "../redux/reducers/meter-reading-proerties";
import { BookNumberI, Property, PropertyI, BillGroupI } from "../models/meter-reading";
import { asyncForEach } from "../helpers/functions";
import { fetchAllCustomerDetailsByBillGroup } from "../models/axios";
import { ActivityIndicator, Searchbar, List } from "react-native-paper";
import Colors from "../constants/Colors";
import { FlatList } from "react-native-gesture-handler";
import Strings from "../constants/Strings";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface PropI {
  properties: MeterReadingPropertiesReducerI;
  setMRProperties(properties: MeterReadingPropertiesReducerI): void;
  route: {
    params: { manNumber: string; bookNumber: BookNumberI, billGroup: BillGroupI };
  };
}

const PropertiesScreen = ({ properties, setMRProperties, route }: PropI) => {
  const navigator = useNavigation();
  const { manNumber, bookNumber, billGroup } = route.params;
  const props = properties[bookNumber.CODE];
  const [loading, setLoading] = useState(false);
  const [displayList, setDisplayList] = useState<PropertyI[]>(
    props && props.length ? props : []
  );
  const [filteredDisplayList, setFilteredDisplayList] = useState<PropertyI[]>(
    []
  );
  const [searchQuery, setSearchQuery] = React.useState("");

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 1) {
      query = query.toLocaleLowerCase();
      const filtered = displayList.filter(
        (bn) =>
          `${bn.PLOT_NO} ${bn.Customer_Address} ${bn.Township} ${bn.MeterNumber}`
            .toLocaleLowerCase()
            .indexOf(query) !== -1
      );
      setFilteredDisplayList(filtered);
      // console.log("here....", filtered.length);
    } else {
      setFilteredDisplayList([]);
      // console.log("nope....");
    }
  };

  useEffect(() => {
    let is_subscribed = true;

    if (is_subscribed && !(props && props.length !== 0)) {
      fetchProperties();
    }

    return () => {
      is_subscribed = false;
    };
  }, []);

  function removeDuplicates<T>(array: T[]): T[] {
    return Array.from(new Set(array));
  }

  const fetchProperties = async () => {
    setLoading(true);
    const pay: MeterReadingPropertiesReducerI = {};

    const { data } = await fetchAllCustomerDetailsByBillGroup(bookNumber);
    const { success, payload } = data;
    // console.log(data);
    if (success) {
      payload.recordset.forEach((p) => {
        p = new Property(p);
        let items = pay[p.BOOK_NO];
        if (!items) {
          items = [];
        }

        pay[p.BOOK_NO] = [...items, p];
      });

      Object.keys(pay).forEach((key) => {
        pay[key] = removeDuplicates<PropertyI>(pay[key]);
      });

      setMRProperties(pay);
      setDisplayList(pay[bookNumber.CODE]);
    }
    setLoading(false);
  };

  const renderListItem = ({ item }: { item: PropertyI }) => {
    //   const desc =
    return (
      <List.Item
        onPress={() =>
          navigator.navigate(Strings.ReadMeterScreen, {
            manNumber,
            billGroup,
            property: item,
          })
        }
        title={item.MeterNumber}
        description={`${item.PLOT_NO} ${item.Customer_Address} ${item.Township}`.trim()}
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
            >
              Loading properties...
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
      <Searchbar
        placeholder={`Search Book Number`}
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <FlatList
        removeClippedSubviews={true}
        maxToRenderPerBatch={20}
        initialNumToRender={20}
        data={filteredDisplayList.length ? filteredDisplayList : displayList}
        keyExtractor={(item: PropertyI) =>
          `${item.BILLGROUP}_${item.BOOK_NO}_${item.MeterNumber}`
        }
        renderItem={renderListItem}
      />
    </View>
  );
};

const mapPropsToState = ({ properties }: RootReducerI) => ({ properties });

const matchDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      setMRProperties,
    },
    dispatch
  );

export default connect(mapPropsToState, matchDispatchToProps)(PropertiesScreen);

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
