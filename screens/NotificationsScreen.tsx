import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Platform,
  Text,
  Alert,
} from "react-native";
import { FlatList, TouchableHighlight } from "react-native-gesture-handler";
import { NotificationI } from "../models/notification";
import { Divider, Heading, Subtitle } from "material-bread";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NotificationType, NotificationStatus } from "../types/notification";
import Colors from "../constants/Colors";

function Icon(type: NotificationType) {
  switch (type) {
    case NotificationType.disconnection:
      return (
        <MaterialCommunityIcons
          size={30}
          color="#1081e9"
          name="pipe-disconnected"
        />
      );
    case NotificationType.reconnection:
      return (
        <MaterialCommunityIcons
          size={30}
          color="#1081e9"
          name="pipe-disconnected"
        />
      );
    case NotificationType["payment-success"]:
      return (
        <Ionicons
          color="#00bb27"
          size={30}
          name={`${
            Platform.OS === "ios" ? "ios" : "md"
          }-checkmark-circle-outline`}
        />
      );
    case NotificationType["payment-failure"]:
      return (
        <Ionicons
          color={Colors.LwscOrange}
          size={30}
          name={`${Platform.OS === "ios" ? "ios" : "md"}-warning`}
        />
      );
    case NotificationType.notice:
      return (
        <Ionicons
          color={`${Colors.LwscBlack}88`}
          size={30}
          name={`${
            Platform.OS === "ios" ? "ios" : "md"
          }-information-circle-outline`}
        />
      );
  }
}

function Item({ date, title, message, type, status }: NotificationI) {
  return (
    <React.Fragment>
      <TouchableHighlight
        underlayColor="#55555539"
        onPress={() => {
          Alert.alert(title, message);
        }}
        style={{
          padding: 10,
          // marginBottom: 5,
          backgroundColor:
            status === NotificationStatus.read
              ? "#fcfcfc"
              : `${Colors.linkBlue}11`,
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
          {Icon(type)}
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
              {date}
            </Text>
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={{ color: `${Colors.LwscBlackLighter}` }}
            >
              {message}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
      <Divider style={{ marginVertical: 0 }} />
    </React.Fragment>
  );
}

const DATA = [
  {
    _id: "5e9d529cd0b97ea29959edca",
    date: "Monday, April 20, 2020 4:15 AM",
    title: "do esse",
    status: NotificationStatus.unread,
    message:
      "ea deserunt ut consequat non anim ad ullamco enim Lorem ut magna eu consectetur deserunt culpa esse fugiat cillum nisi",
    type: NotificationType.reconnection,
  },
  {
    _id: "5e9d529c0ea90b1ffcceb841",
    date: "Monday, April 20, 2020 1:35 AM",
    status: NotificationStatus.read,
    title: "ut velit id nisi magna duis",
    message:
      "proident duis proident sit ad reprehenderit pariatur adipisicing aliqua nulla ad in culpa in ad tempor ut duis cupidatat fugiat",
    type: NotificationType.notice,
  },
  {
    _id: "5e9d529ca84b48cc3afa76d8",
    date: "Monday, April 20, 2020 1:08 AM",
    status: NotificationStatus.unread,
    title: "officia nisi et",
    message:
      "veniam labore sit sit minim excepteur occaecat fugiat culpa consequat duis et Lorem ullamco tempor do ipsum duis est veniam",
    type: NotificationType["payment-failure"],
  },
  {
    _id: "5e9d529c1092f1db9940813a",
    date: "Monday, April 20, 2020 7:04 AM",
    status: NotificationStatus.read,
    title: "aute eu sint amet sit",
    message:
      "consequat ut dolor nostrud dolore velit ad ut esse consequat sint ad sunt voluptate non id amet aute enim nostrud",
    type: NotificationType.disconnection,
  },
  {
    _id: "5e9d529c67a33b79006bb4fa",
    date: "Monday, April 20, 2020 5:20 AM",
    status: NotificationStatus.read,
    title: "cillum nostrud nisi",
    message:
      "aliquip sint dolore consequat aliqua pariatur elit enim irure amet tempor fugiat irure Lorem commodo ex tempor tempor ex labore",
    type: NotificationType.disconnection,
  },
  {
    _id: "5e9d529ce68c8e3c0e595de2",
    date: "Monday, April 20, 2020 2:44 AM",
    status: NotificationStatus.unread,
    title: "aute quis",
    message:
      "elit enim ullamco consectetur occaecat anim in consequat cillum quis eu eu sit officia minim ullamco aliqua ullamco nostrud ut",
    type: NotificationType.notice,
  },
  {
    _id: "5e9d529c025a9b4454022e03",
    date: "Monday, April 20, 2020 1:55 AM",
    status: NotificationStatus.unread,
    title: "officia irure enim dolor",
    message:
      "dolore velit consequat deserunt ut occaecat quis labore eu fugiat nisi ipsum ad exercitation veniam nostrud veniam nulla laboris commodo",
    type: NotificationType.disconnection,
  },
  {
    _id: "5e9d529c56f08276363bf755",
    date: "Monday, April 20, 2020 6:07 AM",
    status: NotificationStatus.read,
    title: "pariatur sint non tempor",
    message:
      "reprehenderit deserunt do et quis in aliqua minim irure sit velit adipisicing qui aute minim culpa deserunt magna mollit do",
    type: NotificationType["payment-success"],
  },
];

const NotificationsScreen = () => {
  const { container } = styles;
  return (
    <SafeAreaView style={container}>
      <FlatList
        data={DATA}
        renderItem={({ item }) => Item(item)}
        keyExtractor={(item) => item._id}
      />
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "#fff",
  },
});
