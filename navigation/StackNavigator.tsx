import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { connect } from "react-redux";
import {
  AsyncStorage,
  Vibration,
  Platform,
  Alert,
  BackHandler,
} from "react-native";
import { bindActionCreators } from "redux";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import NetInfo from "@react-native-community/netinfo";
import Constants from "expo-constants";

import HomeTabNavigator from "./HomeTabNavigator";
import NotificationsScreen from "../screens/NotificationsScreen";
import LocatePaypointScreen from "../screens/LocatePaypointScreen";
import ManageAccountsScreen from "../screens/ManageAccountsScreen";
import PaymentMethodScreen from "../screens/PaymentMethodScreen";
import ServicesScreen from "../screens/ServicesScreen";
import FeedbackScreen from "../screens/FeedbackScreen";
import MakePaymentScreen from "../screens/MakePaymentScreen";
import AccountOpeningDomestic from "../screens/service_forms/AccountOpeningDomestic";
import Boswer from "../screens/service_forms/Boswer";
import PaymentScreen from "../screens/PaymentScreen";
import WebviewScreen from "../screens/WebviewScreen";
import Strings from "../constants/Strings";
import { setThemeReducer } from "../redux/actions/theme";
import { RootReducerI } from "../redux/reducers";
import { ThemeReducer } from "../types/theme";
import { NotificationI, Notification } from "../models/notification";
import {
  setNotifications,
  addNotification,
} from "../redux/actions/notifications";
import { setAccounts } from "../redux/actions/accounts";
import { AccountReducerI } from "../redux/reducers/accounts";
import { Account } from "../models/account";
import { setPayPoints } from "../redux/actions/pay-points";
import { PayPoint } from "../models/pay-point";
import MeterReadingScreen from "../screens/MeterReadingScreen";
import { setPaymentHistory } from "../redux/actions/payment-history";
import { PaymentHistory } from "../models/payment-history";
import ReportLeakageScreen from "../screens/ReportLeakageScreen";
import LodgeComplaintScreen from "../screens/LodgeComplaintScreen";
import GeneralServiceForm from "../screens/service_forms/GeneralServiceForm";
import ReConnection from "../screens/service_forms/ReConnection";
import ApplyForPaymentScheduleScreen from "../screens/ApplyForPaymentScheduleScreen";
import ReadMeterScreen from "../screens/ReadMeterScreen";
import LwscStaffAuthScreen from "../screens/LwscStaffAuthScreen";
import { PayPointReducer } from "../types/paypoint";
import { setBillGroups } from "../redux/actions/bill-groups";
import { setBookNumbers } from "../redux/actions/book-numbers";
import { setMRProperties } from "../redux/actions/meter-reading-properties";
import { BillGroupReducerI } from "../redux/reducers/bill-groups";
import { BookNumberReducerI } from "../redux/reducers/book-number";
import { MeterReadingPropertiesReducerI } from "../redux/reducers/meter-reading-proerties";
import { BookNumber, Property } from "../models/meter-reading";
import BillGroupScreen from "../screens/BillGroupScreen";
import BookNumbersScreen from "../screens/BookNumbersScreen";
import PropertiesScreen from "../screens/PropertiesScreen";
import { AccessNotesReducerI } from "../redux/reducers/access-notes";
import { setAccessNotes } from "../redux/actions/access-notes";
import { setActiveAccount } from "../redux/actions/active-account";
import { ActiveAccountReducerI } from "../redux/reducers/active-account";
import PaymentHistoryScreen from "../screens/PaymentHistoryScreen";
import PaymentHistoryListScreen from "../screens/PaymentHistoryListScreen";
import PaymentStatementScreen from "../screens/PaymentStatementScreen";
import { setPushTokenSubmitted } from "../redux/actions/push-token";
import { submitPushToken } from "../models/axios";

const Stack = createStackNavigator();

interface SNI {
  themeReducer: ThemeReducer;
  pushTokenSubmitted: boolean;
  notifications: NotificationI[];
  setThemeReducer(themeReducer: ThemeReducer): void;
  setPushTokenSubmitted(isSubmitted: boolean): void;
  setNotifications(notifications: NotificationI[]): void;
  addNotification(notifications: NotificationI): void;
  setAccounts(accounts: AccountReducerI): void;
  setPayPoints(paypoints: PayPointReducer): void;
  setBillGroups(billGroups: BillGroupReducerI): void;
  setBookNumbers(bookNumbers: BookNumberReducerI): void;
  setMRProperties(properties: MeterReadingPropertiesReducerI): void;
  setAccessNotes(accessNotes: AccessNotesReducerI): void;
  setActiveAccount(activeAccount: ActiveAccountReducerI): void;
}

type SNT = SNI;

const StackNavigator = ({
  setThemeReducer,
  themeReducer,
  pushTokenSubmitted,
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
}: SNT) => {
  NetInfo.configure({
    reachabilityUrl: "https://41.72.107.14:3000/api/v1/services/types/fetch",
    reachabilityTest: async (response) => response.status === 200,
    reachabilityLongTimeout: 60 * 1000, // 60s
    reachabilityShortTimeout: 5 * 1000, // 5s
    reachabilityRequestTimeout: 15 * 1000, // 15s
  });

  const [pushToken, setPushToken] = React.useState("");
  const [pushNotification, setPushNotification] = React.useState(null);
  const [activeTheme, setActiveTheme] = React.useState(themeReducer.theme);

  const registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      const token = await Notifications.getExpoPushTokenAsync();
      // console.log(token);
      setPushToken(token);

      if (!pushTokenSubmitted) {
        submitToken(token);
      }
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.createChannelAndroidAsync("default", {
        name: "default",
        sound: true,
        priority: "max",
        vibrate: [0, 250, 250, 250],
      });
    }
  };

  const handleNotification = React.useCallback((notification) => {
    Vibration.vibrate(3);
    setPushNotification(notification);
    addNotification(notification);
  }, []);

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
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
      let isTokenSubmittedStr;

      try {
        theme = await AsyncStorage.getItem(Strings.THEME_STORAGE);
        accounts = await AsyncStorage.getItem(Strings.ACCOUNTS_STORAGE);
        await AsyncStorage.removeItem(Strings.PAYPOINTS_STORAGE);
        paypoints = await AsyncStorage.getItem(Strings.PAYPOINTS_STORAGE);
        paymentHistory = await AsyncStorage.getItem(
          Strings.PAYMENT_HISTORY_STORAGE
        );

        notifications = await AsyncStorage.getItem(
          Strings.NOTIFICATIONS_STORAGE
        );
        // await AsyncStorage.removeItem(Strings.BOOK_NUMBER_STORAGE)
        // await AsyncStorage.removeItem(Strings.MR_PROPERTY_STORAGE)
        billGroups = await AsyncStorage.getItem(Strings.BILL_GROUP_STORAGE);
        bookNumbers = await AsyncStorage.getItem(Strings.BOOK_NUMBER_STORAGE);
        properties = await AsyncStorage.getItem(Strings.MR_PROPERTY_STORAGE);

        // await AsyncStorage.removeItem(Strings.ACCESS_NOTES_STORAGE)
        accessNotes = await AsyncStorage.getItem(Strings.ACCESS_NOTES_STORAGE);

        activeAccount = await AsyncStorage.getItem(
          Strings.ACTIVE_ACCOUNT_STORAGE
        );

        isTokenSubmittedStr = await AsyncStorage.getItem(
          Strings.PUSH_TOKEN_STORAGE
        );
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      // dispatch({ type: "RESTORE_TOKEN", token: userToken });
      if (theme) {
        // console.log(theme);
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
        // const pp: any = {};
        // const regions = JSON.parse(paypoints);
        // for (const key in regions) {
        //   if (regions.hasOwnProperty(key)) {
        //     const region = regions[key];
        //     pp[key] = region.map((p: any) => new PayPoint(p));
        //   }
        // }
        // const pp: any = []
        console.log(paypoints);
        paypoints = paypoints == "undefined" ? [] : JSON.parse(paypoints);

        setPayPoints(JSON.parse(paypoints));
      }

      if (paymentHistory) {
        setPaymentHistory(
          JSON.parse(paymentHistory).map((ph: any) => new PaymentHistory(ph))
        );
      }

      if (billGroups) {
        // console.log(JSON.parse(billGroups));
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

      if (isTokenSubmittedStr) {
        setPushTokenSubmitted(JSON.parse(isTokenSubmittedStr));
      }
    };

    bootstrapAsync();
  }, []);

  // React.useEffect(() => {
  //   let is_subscribed = true;

  //   if (is_subscribed) {
  //     setNotifications(notifications);
  //   }

  //   return () => {
  //     is_subscribed = false;
  //   };
  // }, [notifications]);

  // React.useEffect(() => {
  //   let is_subscribed = true;

  //   if (is_subscribed) {
  //     setActiveTheme(themeReducer.theme);
  //   }

  //   return () => {
  //     is_subscribed = false;
  //   };
  // }, [themeReducer]);

  React.useEffect(() => {
    let is_subscribed = true;

    if (is_subscribed) {
      registerForPushNotificationsAsync();
    }

    return () => {
      is_subscribed = false;
    };
  }, [pushTokenSubmitted]);

  React.useEffect(() => {
    let notificationSubscription = Notifications.addListener(
      handleNotification
    );

    return () => {
      notificationSubscription.remove();
    };
  }, [handleNotification]);

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      // console.log(state);
      if (!state.isConnected) {
        Alert.alert(
          Strings.INTERNET_FAILURE.title,
          Strings.INTERNET_FAILURE.message,
          [{ text: "Exit", onPress: () => BackHandler.exitApp() }]
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const submitToken = async (token: string) => {
    try {
      const { status, data } = await submitPushToken(token);

      if (status === 200 && data.success) {
        setPushTokenSubmitted(true);
        console.log(data);
      } else {
        throw new Error("failed to submit token");
      }
    } catch (err) {
      // sent error report
    }
  };

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
        // initialParams={{ toNotifications: pushNotification ? true : false }}
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
    </Stack.Navigator>
  );
};

const mapStateToProps = ({
  theme,
  notifications,
  pushTokenSubmitted,
}: RootReducerI) => ({
  themeReducer: theme,
  pushTokenSubmitted,
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
      setPushTokenSubmitted,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(StackNavigator);
