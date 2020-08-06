import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import React, { useState, useEffect, useRef } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Platform, AsyncStorage } from "react-native";
import { RootReducerI } from "../redux/reducers";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setThemeReducer } from "../redux/actions/theme";
import {
  setNotifications,
  addNotification,
} from "../redux/actions/notifications";
import { setAccounts } from "../redux/actions/accounts";
import { setPayPoints } from "../redux/actions/pay-points";
import { setBillGroups } from "../redux/actions/bill-groups";
import { setBookNumbers } from "../redux/actions/book-numbers";
import { setMRProperties } from "../redux/actions/meter-reading-properties";
import { setAccessNotes } from "../redux/actions/access-notes";
import { setActiveAccount } from "../redux/actions/active-account";
import { setPushToken } from "../redux/actions/push-token";
import { ThemeReducer } from "../types/theme";
import { NotificationI, Notification } from "../models/notification";
import { AccountReducerI } from "../redux/reducers/accounts";
import { PaypointI } from "../models/pay-point";
import { BillGroupReducerI } from "../redux/reducers/bill-groups";
import { BookNumberReducerI } from "../redux/reducers/book-number";
import { MeterReadingPropertiesReducerI } from "../redux/reducers/meter-reading-proerties";
import { AccessNotesReducerI } from "../redux/reducers/access-notes";
import { ActiveAccountReducerI } from "../redux/reducers/active-account";
import { BookNumber, Property } from "../models/meter-reading";
import Strings from "../constants/Strings";
import { Account } from "../models/account";
import { PaymentHistory } from "../models/payment-history";
import { setPaymentHistory } from "../redux/actions/payment-history";
import { StatementI } from "../models/statement";
import HomeTabNavigator from "./HomeTabNavigator";
import NotificationsScreen from "../screens/NotificationsScreen";
import LocatePaypointScreen from "../screens/LocatePaypointScreen";
import ManageAccountsScreen from "../screens/ManageAccountsScreen";
import PaymentMethodScreen from "../screens/PaymentMethodScreen";
import ServicesScreen from "../screens/ServicesScreen";
import FeedbackScreen from "../screens/FeedbackScreen";
import MakePaymentScreen from "../screens/MakePaymentScreen";
import PaymentScreen from "../screens/PaymentScreen";
import WebviewScreen from "../screens/WebviewScreen";
import Boswer from "../screens/service_forms/Boswer";
import AccountOpeningDomestic from "../screens/service_forms/AccountOpeningDomestic";
import MeterReadingScreen from "../screens/MeterReadingScreen";
import ReportLeakageScreen from "../screens/ReportLeakageScreen";
import LodgeComplaintScreen from "../screens/LodgeComplaintScreen";
import GeneralServiceForm from "../screens/service_forms/GeneralServiceForm";
import ReConnection from "../screens/service_forms/ReConnection";
import ApplyForPaymentScheduleScreen from "../screens/ApplyForPaymentScheduleScreen";
import ReadMeterScreen from "../screens/ReadMeterScreen";
import LwscStaffAuthScreen from "../screens/LwscStaffAuthScreen";
import BillGroupScreen from "../screens/BillGroupScreen";
import BookNumbersScreen from "../screens/BookNumbersScreen";
import PropertiesScreen from "../screens/PropertiesScreen";
import PaymentHistoryScreen from "../screens/PaymentHistoryScreen";
import PaymentHistoryListScreen from "../screens/PaymentHistoryListScreen";
import PaymentStatementScreen from "../screens/PaymentStatementScreen";
import ConsumptionScreen from "../screens/ConsumptionScreen";
import ConsumptionDetails from "../screens/ConsumptionDetails";
import { submitPushToken } from "../models/axios";
import SelectAreaScreen from "../screens/SelectAreaScreen";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Stack = createStackNavigator();

interface SNI {
  themeReducer: ThemeReducer;
  pushToken: string;
  notifications: NotificationI[];
  setThemeReducer(themeReducer: ThemeReducer): void;
  setPushToken(token: string): void;
  setNotifications(notifications: NotificationI[]): void;
  addNotification(notifications: NotificationI): void;
  setAccounts(accounts: AccountReducerI): void;
  setPayPoints(paypoints: PaypointI[]): void;
  setBillGroups(billGroups: BillGroupReducerI): void;
  setBookNumbers(bookNumbers: BookNumberReducerI): void;
  setMRProperties(properties: MeterReadingPropertiesReducerI): void;
  setAccessNotes(accessNotes: AccessNotesReducerI): void;
  setActiveAccount(activeAccount: ActiveAccountReducerI): void;
  setPaymentHistory(history: StatementI[]): void;
}

const StackNavigator = ({
  setThemeReducer,
  themeReducer,
  // pushToken,
  notifications,
  setNotifications,
  addNotification,
  setAccounts,
  setPayPoints,
  setBillGroups,
  setBookNumbers,
  setMRProperties,
  setAccessNotes,
  setActiveAccount,
  setPaymentHistory,
}: SNI) => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const [landScreen, setLandScreen] = useState({ screen: "Home" });
  const notificationListener = useRef();
  const responseListener = useRef();
  const [activeTheme, setActiveTheme] = React.useState(themeReducer.theme);

  const bootstrapAsync = async () => {
    let theme;
    let accounts;
    let paypoints;
    let paymentHistory;
    let billGroups;
    let bookNumbers;
    let properties;
    let accessNotes;
    let activeAccount;
    let notifications;
    let pushTokenStr;

    try {
      theme = await AsyncStorage.getItem(Strings.THEME_STORAGE);
      accounts = await AsyncStorage.getItem(Strings.ACCOUNTS_STORAGE);
      await AsyncStorage.removeItem(Strings.PAYPOINTS_STORAGE);
      paypoints = await AsyncStorage.getItem(Strings.PAYPOINTS_STORAGE);
      paymentHistory = await AsyncStorage.getItem(
        Strings.PAYMENT_HISTORY_STORAGE
      );

      notifications = await AsyncStorage.getItem(Strings.NOTIFICATIONS_STORAGE);
      // await AsyncStorage.removeItem(Strings.NOTIFICATIONS_STORAGE)
      // await AsyncStorage.removeItem(Strings.MR_PROPERTY_STORAGE)
      billGroups = await AsyncStorage.getItem(Strings.BILL_GROUP_STORAGE);
      bookNumbers = await AsyncStorage.getItem(Strings.BOOK_NUMBER_STORAGE);
      properties = await AsyncStorage.getItem(Strings.MR_PROPERTY_STORAGE);

      // await AsyncStorage.removeItem(Strings.ACCESS_NOTES_STORAGE)
      accessNotes = await AsyncStorage.getItem(Strings.ACCESS_NOTES_STORAGE);

      activeAccount = await AsyncStorage.getItem(
        Strings.ACTIVE_ACCOUNT_STORAGE
      );

      pushTokenStr = await AsyncStorage.getItem(Strings.PUSH_TOKEN_STORAGE);
      // console.log(pushTokenStr)
    } catch (e) {
      // Restoring token failed
    }

    if (theme) {
      setThemeReducer(JSON.parse(theme));
      setActiveTheme(JSON.parse(theme).theme);
    }

    if (accounts) {
      accounts = JSON.parse(accounts);
      for (const key in accounts) {
        if (accounts.hasOwnProperty(key)) {
          const element = accounts[key];
          accounts[key] = element.CUSTKEY
            ? new Account(element)
            : element.MeterNumber
            ? new Property(element)
            : element;
        }
      }
      setAccounts(accounts);
    }

    if (paypoints) {
      // console.log(paypoints);
      paypoints = paypoints == "undefined" ? [] : JSON.parse(paypoints);

      setPayPoints(JSON.parse(paypoints));
    }

    if (paymentHistory) {
      setPaymentHistory(
        JSON.parse(paymentHistory).map((ph: any) => new PaymentHistory(ph))
      );
    }

    if (billGroups) {
      setBillGroups(JSON.parse(billGroups));
    }

    if (bookNumbers) {
      const data: BookNumberReducerI = JSON.parse(bookNumbers);
      Object.keys(data).forEach((key) => {
        let bns = data[key];

        bns.map((k) => new BookNumber(k)); // forEach((k) => (bns.CODE = new BookNumber(bns[k])));
      });
      setBookNumbers(data);
    }

    if (properties) {
      const data: MeterReadingPropertiesReducerI = JSON.parse(properties);
      Object.keys(data).forEach((key) => {
        let bns = data[key];
        data[key] = bns.map((item) => new Property(item));
      });
      setMRProperties(data);
    }

    if (accessNotes) {
      setAccessNotes(JSON.parse(accessNotes));
    }

    if (activeAccount) {
      setActiveAccount(JSON.parse(activeAccount));
    }

    if (notifications) {
      setNotifications(
        JSON.parse(notifications).map(
          (item: NotificationI) => new Notification(item)
        )
      );
    }

    // console.log(`pushTokenStr: ${pushTokenStr}`);
    // if (pushTokenStr) {
    //   setPushToken(pushTokenStr);
    //   setToken(pushTokenStr);
    // }

    // setBootstrapping(false);
  };

  const submitToken = async (token: string) => {
    try {
      const { status, data } = await submitPushToken(token);

      if (status === 200 && data.success) {
        setPushToken(token);
      } else {
        throw new Error("failed to submit token");
      }
    } catch (err) {
      // sent error report
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token as string);
      submitToken(token as string);
    });

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification: any) => {
        setNotification(notification);
        addNotification(notification);
        // console.log(notification);
      }
    );

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        // const url = response.notification.request.content.data.url;
        // console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR')
        // console.log(response.notification);
        addNotification(response.notification.request.content);
        setLandScreen({ screen: "Notifications" });
        // console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR')
        // Linking.openUrl(url);
      }
    );

    bootstrapAsync();

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);
  console.log(landScreen);

  return (
    <Stack.Navigator
      initialRouteName={Strings.HomeTabNavigator}
      screenOptions={{
        headerStyle: {
          backgroundColor: activeTheme.backgroundColor,
        },
        headerTintColor: activeTheme.textColor,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        // headerRight: () => (
        //   <HeaderRightComponent notifications={notifications.length} />
        // ),
      }}
    >
      <Stack.Screen
        name={Strings.HomeTabNavigator}
        component={HomeTabNavigator}
        initialParams={landScreen}
        options={{ header: (props) => null }}
      />
      <Stack.Screen
        name={Strings.NotificationsScreen}
        component={NotificationsScreen}
      />
      <Stack.Screen
        name={Strings.LocatePayPointScreen}
        component={LocatePaypointScreen}
      />
      <Stack.Screen
        name={Strings.ManageAccountsScreen}
        component={ManageAccountsScreen}
      />
      <Stack.Screen
        name={Strings.PaymentMethodScreen}
        component={PaymentMethodScreen}
      />
      <Stack.Screen name={Strings.ServicesScreen} component={ServicesScreen} />
      <Stack.Screen name={Strings.FeedbackScreen} component={FeedbackScreen} />
      <Stack.Screen
        name={Strings.MakePaymentScreen}
        component={MakePaymentScreen}
      />
      <Stack.Screen name={Strings.PaymentScreen} component={PaymentScreen} />
      <Stack.Screen name={Strings.WebviewScreen} component={WebviewScreen} />
      <Stack.Screen name={Strings.BowserForm} component={Boswer} />
      <Stack.Screen
        name={Strings.OpenAccountForm}
        component={AccountOpeningDomestic}
      />
      <Stack.Screen
        name={Strings.MeterReadingScreen}
        component={MeterReadingScreen}
      />
      <Stack.Screen
        name={Strings.ReportLeakageScreen}
        component={ReportLeakageScreen}
      />
      <Stack.Screen
        name={Strings.LodgeComplaintScreen}
        component={LodgeComplaintScreen}
      />
      <Stack.Screen
        name={Strings.GeneralServiceForm}
        component={GeneralServiceForm}
      />
      <Stack.Screen name={Strings.ReConnection} component={ReConnection} />
      <Stack.Screen
        name={Strings.ApplyForPaymentScheduleScreen}
        component={ApplyForPaymentScheduleScreen}
      />
      <Stack.Screen
        name={Strings.ReadMeterScreen}
        component={ReadMeterScreen}
      />
      <Stack.Screen
        name={Strings.LwscStaffAuthScreen}
        component={LwscStaffAuthScreen}
      />
      <Stack.Screen
        name={Strings.BillGroupScreen}
        component={BillGroupScreen}
      />
      <Stack.Screen
        name={Strings.BookNumbersScreen}
        component={BookNumbersScreen}
      />
      <Stack.Screen
        name={Strings.PropertiesScreen}
        component={PropertiesScreen}
      />
      <Stack.Screen
        name={Strings.PaymentHistoryScreen}
        component={PaymentHistoryScreen}
      />
      <Stack.Screen
        name={Strings.PaymentHistoryListScreen}
        component={PaymentHistoryListScreen}
      />
      <Stack.Screen
        name={Strings.PaymentStatementScreen}
        component={PaymentStatementScreen}
      />
      <Stack.Screen
        name={Strings.ConsumptionScreen}
        component={ConsumptionScreen}
      />
      <Stack.Screen
        name={Strings.ConsumptionDetails}
        component={ConsumptionDetails}
      />
      <Stack.Screen
        name={Strings.SelectAreaScreen}
        component={SelectAreaScreen}
      />
    </Stack.Navigator>
  );
};

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

const mapStateToProps = ({
  theme,
  notifications,
  pushToken,
}: RootReducerI) => ({
  themeReducer: theme,
  pushToken,
  notifications,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      setThemeReducer,
      setNotifications,
      addNotification,
      setAccounts,
      setPayPoints,
      setBillGroups,
      setBookNumbers,
      setMRProperties,
      setAccessNotes,
      setActiveAccount,
      setPushToken,
      setPaymentHistory,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(StackNavigator);
