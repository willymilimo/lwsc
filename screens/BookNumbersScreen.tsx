import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Modal, Alert } from "react-native";
import { BillGroupI, BookNumberI, BookNumber } from "../models/meter-reading";
import { RootReducerI } from "../redux/reducers";
import { bindActionCreators } from "redux";
import { setBookNumbers } from "../redux/actions/book-numbers";
import { connect } from "react-redux";
import { BookNumberReducerI } from "../redux/reducers/book-number";
import { useNavigation } from "@react-navigation/native";
import { fetchAllBookNumbers } from "../models/axios";
import { List, ActivityIndicator, Searchbar } from "react-native-paper";
import Strings from "../constants/Strings";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { FlatList } from "react-native-gesture-handler";

interface PropI {
  bookNumbers: BookNumberReducerI;
  setBookNumbers(bookNumbers: BookNumberReducerI): void;
  route: {
    params: { billGroup: BillGroupI };
  };
}

const BookNumbersScreen = ({ bookNumbers, setBookNumbers, route }: PropI) => {
  const navigator = useNavigation();
  const { billGroup } = route.params;
  const props = bookNumbers[billGroup.GROUP_ID];
  const [loading, setLoading] = useState(false);
  const [displayList, setDisplayList] = useState<BookNumberI[]>(
    props && Object.values(props).length ? Object.values(props) : []
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

  useEffect(() => {
    let is_subscribed = true;

    if (is_subscribed && !Object.keys(bookNumbers).length) {
      fetchBookNumbers();
    }

    return () => {
      is_subscribed = false;
    };
  }, []);

  const renderListItem = ({ item }: { item: BookNumberI }) => (
    <List.Item
      onPress={() =>
        navigator.navigate(Strings.PropertiesScreen, {
          bookNumber: item,
          billGroup: billGroup,
        })
      }
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

  const fetchBookNumbers = async () => {
    setLoading(true);

    fetchAllBookNumbers()
      .then(({ status, data }) => {
        const { success, payload } = data;

        if (status === 200 && success) {
          const pay: BookNumberReducerI = {};

          payload.recordset.forEach((bg) => {
            bg = new BookNumber(bg);
            let items = pay[bg.BILLGROUP];

            if (!items) items = [];
            if (bg.CODE) {
              pay[bg.BILLGROUP] = [...items, bg];
            }
          });

          setBookNumbers(pay);
          setDisplayList(Object.values(pay[billGroup.GROUP_ID]));
        } else {
          Alert.alert(
            "Load Failure",
            "Failed to load book numbers. Please try again later.",
            [
              {
                text: "Cancel",
                onPress: () => navigator.navigate(Strings.HomeTabNavigator),
              },
              { text: "RETRY", onPress: fetchBookNumbers },
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
              Loading book numbers
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
        keyExtractor={(item: BookNumberI) => `${item.BILLGROUP}_${item.CODE}`}
        renderItem={renderListItem}
      />
    </View>
  );
};

const mapPropsToState = ({ bookNumbers }: RootReducerI) => ({ bookNumbers });

const matchDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      setBookNumbers,
    },
    dispatch
  );

export default connect(
  mapPropsToState,
  matchDispatchToProps
)(BookNumbersScreen);

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
