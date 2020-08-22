import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import React, { useState, useEffect, useRef } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Platform } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { IconButton } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { setThemeReducer } from "../redux/actions/theme";
import { RootReducerI } from "../redux/reducers";
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
import { NotificationI } from "../models/notification";
import Strings from "../constants/Strings";
import { setPaymentHistory } from "../redux/actions/payment-history";
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
import ReportLeakageScreen from "../screens/ReportLeakageScreen";
import LodgeComplaintScreen from "../screens/LodgeComplaintScreen";
import GeneralServiceForm from "../screens/service_forms/GeneralServiceForm";
import ReConnection from "../screens/service_forms/ReConnection";
import ApplyForPaymentScheduleScreen from "../screens/ApplyForPaymentScheduleScreen";
import PaymentHistoryScreen from "../screens/PaymentHistoryScreen";
import PaymentHistoryListScreen from "../screens/PaymentHistoryListScreen";
import PaymentStatementScreen from "../screens/PaymentStatementScreen";
import ConsumptionScreen from "../screens/ConsumptionScreen";
import ConsumptionDetails from "../screens/ConsumptionDetails";
import { submitPushToken } from "../models/axios";
import SelectAreaScreen from "../screens/SelectAreaScreen";
import RequestServiceScreen from "../screens/RequestServiceScreen";
import { setUserReducer } from "../redux/actions/user";
import MeterReadingNavigator from "./MeterReadingNavigator";
import { navigate } from "./RootNavigation";
import ServiceInvoiceScreen from "../screens/ServiceInvoiceScreen";

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
  setPushToken(token: string): void;
  addNotification(notifications: NotificationI): void;

}

const StackNavigator = ({
  themeReducer,
  addNotification,
}: SNI) => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const [landScreen, setLandScreen] = useState({ screen: "Home" });
  const notificationListener = useRef();
  const responseListener = useRef();
  const [activeTheme, setActiveTheme] = React.useState(themeReducer.theme);

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

    // bootstrapAsync();

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

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
        headerRight: ({ tintColor }) => (
          <IconButton
            icon={() => (
              <Ionicons
                onPress={() => navigate(Strings.HomeTabNavigator)}
                style={{ marginRight: 10 }}
                size={25}
                color={tintColor}
                name={`${Platform.OS === "ios" ? "ios" : "md"}-home`}
              />
            )}
            color={tintColor}
          />
        ),
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
        options={{ title: "Meter Reading", headerShown: false }}
        name={Strings.MeterReadingNavigator}
        component={MeterReadingNavigator}
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
      <Stack.Screen
        name={Strings.RequestServiceScreen}
        component={RequestServiceScreen}
      />
      <Stack.Screen
        name={Strings.ServiceInvoiceScreen}
        component={ServiceInvoiceScreen}
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
      setUserReducer,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(StackNavigator);
