import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { RootReducerI } from "../redux/reducers";
import { bindActionCreators } from "redux";
import { setBookNumbers } from "../redux/actions/book-numbers";
import { BookNumberI, BookNumber } from "../models/meter-reading";
import { BookNumberReducerI } from "../redux/reducers/book-number";
import { fetchAllBookNumbers } from "../models/axios";
import { useNavigation } from "@react-navigation/native";
import { List, Searchbar } from "react-native-paper";
import Strings from "../constants/Strings";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { FlatList } from "react-native-gesture-handler";

interface PropI {
  bookNumbers: BookNumberReducerI;
  onSelectCallback(bookNumber: BookNumberI): void;
  setBookNumbers(bookNumbers: BookNumberReducerI): void;
}

const SelectAreaScreen = ({
  bookNumbers,
  onSelectCallback,
  setBookNumbers,
}: PropI) => {
  const navigator = useNavigation();
  const [loading, setLoading] = useState(false);
  const [displayList, setDisplayList] = useState<BookNumberI[]>([]);
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

  const renderListItem = ({ item }: { item: BookNumberI }) => (
    <List.Item
      onPress={() => {}}
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
      .catch((e) => {})
      .finally(() => setLoading(false));
  };

  return (
    <View>
      <>
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
      </>
    </View>
  );
};

const mapStateToProps = ({ bookNumbers }: RootReducerI) => ({ bookNumbers });

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
