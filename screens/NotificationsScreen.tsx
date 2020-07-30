import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Platform,
  Text,
  Alert,
  Modal,
} from "react-native";
import { FlatList, TouchableHighlight } from "react-native-gesture-handler";
import { NotificationI, Notification } from "../models/notification";
import Colors from "../constants/Colors";
import { Divider, ActivityIndicator } from "react-native-paper";
import { fetchNotifications } from "../models/axios";
import Strings from "../constants/Strings";
import { useNavigation } from "@react-navigation/native";
import { RootReducerI } from "../redux/reducers";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  setNotificationRead,
  addNotification,
} from "../redux/actions/notifications";

interface PropI {
  notifications: NotificationI[];
  addNotification(notification: NotificationI): void;
  setNotificationRead(id: string): void;
}

const NotificationsScreen = ({
  notifications,
  addNotification,
  setNotificationRead,
}: PropI) => {
  const { container } = styles;
  const navigator = useNavigation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let is_subscribed = true;

    if (is_subscribed) {
      getchNotifications();
    }
    return () => {
      is_subscribed = false;
    };
  }, []);

  const renderListItem = ({ item }: { item: NotificationI }) => {
    const { _id, is_read, title, description, create_on } = item;
    return (
      <>
        <TouchableHighlight
          underlayColor="#55555539"
          onPress={() => {
            Alert.alert(title, description, [
              { onPress: () => setNotificationRead(_id) },
            ]);
          }}
          style={{
            padding: 10,
            backgroundColor: is_read ? "#fcfcfc" : `${Colors.linkBlue}11`,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 10,
            }}
          >
            <View style={{ paddingHorizontal: 10 }}>
              <Text
                style={{
                  textTransform: "capitalize",
                  fontWeight: "bold",
                  color: `${Colors.LwscBlack}bb`,
                }}
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                {create_on.toLocaleString()}
              </Text>
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={{ color: `${Colors.LwscBlackLighter}` }}
              >
                {description}
              </Text>
            </View>
          </View>
        </TouchableHighlight>
        <Divider style={{ marginVertical: 0 }} />
      </>
    );
  };

  const getchNotifications = async () => {
    setLoading(true);
    try {
      const { status, data } = await fetchNotifications();
      if (status === 200 && data.success) {
        // setNotifications(data.payload.map((item) => new Notification(item)));
        data.payload.forEach((item) => addNotification(new Notification(item)));
      } else {
        throw new Error(JSON.stringify(data));
      }
    } catch (err) {
      const { title, message } = Strings.SELF_REPORTING_PROBLEM;
      Alert.alert(title, message, [
        { onPress: () => navigator.navigate(Strings.HomeTabNavigator) },
      ]);
    }
    setLoading(false);
  };

  console.log(loading);
  return (
    <SafeAreaView style={container}>
      <Modal animationType="slide" transparent visible={loading}>
        <View style={[styles.centeredView, { backgroundColor: "#00000077" }]}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large" color={Colors.LwscOrange} />
          </View>
        </View>
      </Modal>
      <FlatList
        removeClippedSubviews={true}
        maxToRenderPerBatch={20}
        initialNumToRender={20}
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={renderListItem}
      />
    </SafeAreaView>
  );
};

const mapPropsToState = ({ notifications }: RootReducerI) => ({
  notifications,
});

const matchDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      addNotification,
      setNotificationRead,
    },
    dispatch
  );

export default connect(
  mapPropsToState,
  matchDispatchToProps
)(NotificationsScreen);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "#fff",
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
});
