import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import { connect } from "react-redux";
import { RootReducerI } from "../redux/reducers";
import { bindActionCreators } from "redux";
import { setBookNumbers } from "../redux/actions/book-numbers";
import { BookNumberI, BookNumber } from "../models/meter-reading";
import { BookNumberReducerI } from "../redux/reducers/book-number";
import { fetchAllBookNumbers, validateBillWindow } from "../models/axios";
import { useNavigation } from "@react-navigation/native";
import { List, Searchbar, ActivityIndicator } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { FlatList } from "react-native-gesture-handler";
import { ServiceApplicationI, ServiceApplication } from "../models/service-application";
import { ServiceReportI } from "../models/service-report";
import { BillGroupReducerI } from "../redux/reducers/bill-groups";
import Strings from "../constants/Strings";

interface PropI {
  route: {
    params: {
      application: ServiceApplicationI | ServiceReportI;
      toRoute: string;
    };
  };
  bookNumbers: BookNumberReducerI;
  billGroups: BillGroupReducerI;
  setBookNumbers(bookNumbers: BookNumberReducerI): void;
}

const SelectAreaScreen = ({
  route,
  bookNumbers,
  billGroups,
  setBookNumbers,
}: PropI) => {
  const navigator = useNavigation();
  const [modalMessage, setModalMessage] = useState("Loading b");
  const { application, toRoute } = route.params;
  const [loading, setLoading] = useState(false);
  const [displayList, setDisplayList] = useState<BookNumberI[]>(
    (() => {
      const result: { [key: string]: BookNumberI } = {};

      Object.values(bookNumbers).forEach((bns) => {
        bns.forEach((bn) => (result[bn.CODE] = new BookNumber(bn)));
      });

      return Object.values(result);
    })()
  );
  const [filteredDisplayList, setFilteredDisplayList] = useState<BookNumberI[]>(
    []
  );
  const [searchQuery, setSearchQuery] = React.useState("");

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 1) {
      query = query.toLocaleLowerCase();
      const filtered = displayList.filter(
        (bn) =>
          bn.CODE.toLocaleLowerCase().indexOf(query) !== -1 ||
          bn.DESCRIBE.toLocaleLowerCase().indexOf(query) !== -1
      );
      setFilteredDisplayList(filtered);
    } else {
      setFilteredDisplayList([]);
    }
  };

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

  const renderListItem = ({ item }: { item: BookNumberI }) => (
    <List.Item
      onPress={async () => {
        if (application instanceof ServiceApplication) {
          application.area = item.CODE;
        }
        // setLoading(true);
        // const cycle_id = await validate(item.BILLGROUP);
        // setLoading(false);

        // if (cycle_id) {
        navigator.navigate(toRoute, {
          bookNumber: item,
          billGroup: billGroups[item.BILLGROUP],
          // cycle_id,
          item: application,
        });
        // } else {
        //   const { title, message } = Strings.BILLING_CYCLE;
        //   Alert.alert(title, message);
        // }
      }}
      title={item.DESCRIBE}
      description={`${item.CODE} - ${item.NO_WALKS} walks`}
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

  useEffect(() => {
    let is_subscribed = true;

    // console.log(Object.keys(bookNumbers).length);
    if (is_subscribed && Object.keys(bookNumbers).length === 0) {
      fetchBookNumbers();
    }

    return () => {
      is_subscribed = false;
    };
  }, [bookNumbers]);

  const fetchBookNumbers = async () => {
    setLoading(true);

    fetchAllBookNumbers()
      .then(({ status, data }) => {
        const { success, payload } = data;

        if (status === 200 && success) {
          const pay: BookNumberReducerI = {};
          const display: BookNumberI[] = [];

          payload.recordset.forEach((bn) => {
            bn = new BookNumber(bn);
            display.push(bn);
            let items = pay[bn.BILLGROUP];

            if (!items) items = [];
            if (bn.CODE) {
              pay[bn.BILLGROUP] = [...items, bn];
            }
          });

          setBookNumbers(pay);
          setDisplayList(display);
        } else {
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => setLoading(false));
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.LwscOrange}
          style={{ alignSelf: "center", marginTop: 20 }}
        />
      ) : displayList.length ? (
        <>
          <Searchbar
            placeholder={`Search Area`}
            onChangeText={onChangeSearch}
            value={searchQuery}
          />
          <FlatList
            removeClippedSubviews={true}
            maxToRenderPerBatch={20}
            initialNumToRender={20}
            data={
              filteredDisplayList.length ? filteredDisplayList : displayList
            }
            keyExtractor={(item: BookNumberI) =>
              `${item.BILLGROUP}_${item.CODE}`
            }
            renderItem={renderListItem}
          />
        </>
      ) : (
        <Text style={{ margin: 15 }}>
          Unable to fetch areas. Please ensure you are connected to the internet
          and try again.
        </Text>
      )}
    </View>
  );
};

const mapStateToProps = ({ bookNumbers, billGroups }: RootReducerI) => ({
  bookNumbers,
  billGroups,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ setBookNumbers }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SelectAreaScreen);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
  },
});
