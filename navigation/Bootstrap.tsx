import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  AsyncStorage,
  StyleSheet,
  Alert,
  BackHandler,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { connect } from "react-redux";
import { RootReducerI } from "../redux/reducers";
import { bindActionCreators } from "redux";
import { setBillGroups } from "../redux/actions/bill-groups";
import { setThemeReducer } from "../redux/actions/theme";
import {
  setNotifications,
  addNotification,
} from "../redux/actions/notifications";
import { setAccounts } from "../redux/actions/accounts";
import { setPayPoints } from "../redux/actions/pay-points";
import { setBookNumbers } from "../redux/actions/book-numbers";
import { setMRProperties } from "../redux/actions/meter-reading-properties";
import { setAccessNotes } from "../redux/actions/access-notes";
import { setActiveAccount } from "../redux/actions/active-account";
import { setPushToken } from "../redux/actions/push-token";
import Strings from "../constants/Strings";
import { setPaymentHistory } from "../redux/actions/payment-history";
import { setUserReducer } from "../redux/actions/user";
import { ThemeReducer } from "../types/theme";
import { NotificationI, Notification } from "../models/notification";
import { AccountReducerI } from "../redux/reducers/accounts";
import { PaypointI } from "../models/pay-point";
import { BillGroupReducerI } from "../redux/reducers/bill-groups";
import { BookNumberReducerI } from "../redux/reducers/book-number";
import { MeterReadingPropertiesReducerI } from "../redux/reducers/meter-reading-proerties";
import { AccessNotesReducerI } from "../redux/reducers/access-notes";
import { ActiveAccountReducerI } from "../redux/reducers/active-account";
import { StatementI } from "../models/statement";
import { UserReducerI } from "../redux/reducers/user";
import { Account } from "../models/account";
import { Property, BookNumber } from "../models/meter-reading";
import { PaymentHistory } from "../models/payment-history";
import { fetchAllBillGroups, fetchConfigStatus } from "../models/axios";
import { Surface, ActivityIndicator } from "react-native-paper";
import Colors from "../constants/Colors";
import DeprecationScreen from "../screens/DeprecationScreen";
import StackNavigator from "./StackNavigator";

const Stack = createStackNavigator();

interface PropI {
  themeReducer: ThemeReducer;
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
  setUserReducer(userReducer: UserReducerI): void;
}

const Loader = () => {
  return (
    <View style={styles.container}>
      <Surface style={styles.surface}>
        <ActivityIndicator size="large" color={Colors.LwscOrange} />
        <Text
          style={{
            marginTop: 20,
            textAlign: "center",
          }}
        >
          Loading necessary resources
        </Text>
        <Text
          style={{
            marginTop: 20,
            textAlign: "center",
          }}
        >{`Please wait...`}</Text>
      </Surface>
      <View style={styles.footer}>
        <Text>Powered by Microtech</Text>
      </View>
    </View>
  );
};

const Bootstrap = ({
  themeReducer,
  setThemeReducer,
  setNotifications,
  setAccounts,
  setPayPoints,
  setBillGroups,
  setBookNumbers,
  setAccessNotes,
  setActiveAccount,
  setPaymentHistory,
  setUserReducer,
}: PropI) => {
  const [activeTheme, setActiveTheme] = React.useState(themeReducer.theme);
  const [loading, setLoading] = useState(true);
  const [deprecated, setDeprecated] = useState(false);

  const bootstrapAsync = async () => {
    setLoading(true);
    const isDeprecated = await getConfigStatus();
    setDeprecated(isDeprecated);

    if (!isDeprecated) {
      let theme;
      let accounts;
      let paypoints;
      let paymentHistory;
      let billGroups;
      let bookNumbers;
      // let properties;
      let accessNotes;
      let activeAccount;
      let notifications;
      let pushTokenStr;
      let userStr;

      try {
        // await AsyncStorage.clear();

        theme = await AsyncStorage.getItem(Strings.THEME_STORAGE);
      } catch (e) {
        // Restoring token failed
      }
      try {
        accounts = await AsyncStorage.getItem(Strings.ACCOUNTS_STORAGE);
      } catch (e) {
        // Restoring token failed
      }
      try {
        paypoints = await AsyncStorage.getItem(Strings.PAYPOINTS_STORAGE);
      } catch (e) {
        // Restoring token failed
      }
      try {
        paymentHistory = await AsyncStorage.getItem(
          Strings.PAYMENT_HISTORY_STORAGE
        );
      } catch (e) {
        // Restoring token failed
      }
      try {
        notifications = await AsyncStorage.getItem(
          Strings.NOTIFICATIONS_STORAGE
        );
      } catch (e) {
        // Restoring token failed
      }
      try {
        // await AsyncStorage.removeItem(Strings.NOTIFICATIONS_STORAGE)
        // await AsyncStorage.removeItem(Strings.MR_PROPERTY_STORAGE)
        billGroups = await AsyncStorage.getItem(Strings.BILL_GROUP_STORAGE);
      } catch (e) {
        // Restoring token failed
      }
      try {
        bookNumbers = await AsyncStorage.getItem(Strings.BOOK_NUMBER_STORAGE);
      } catch (e) {
        // Restoring token failed
      }
      try {
        // properties = await AsyncStorage.getItem(Strings.MR_PROPERTY_STORAGE);

        // await AsyncStorage.removeItem(Strings.ACCESS_NOTES_STORAGE)
        accessNotes = await AsyncStorage.getItem(Strings.ACCESS_NOTES_STORAGE);
      } catch (e) {
        // Restoring token failed
      }
      try {
        activeAccount = await AsyncStorage.getItem(
          Strings.ACTIVE_ACCOUNT_STORAGE
        );
      } catch (e) {
        // Restoring token failed
      }
      try {
        pushTokenStr = await AsyncStorage.getItem(Strings.PUSH_TOKEN_STORAGE);
      } catch (e) {
        // Restoring token failed
      }
      try {
        // console.log(pushTokenStr)

        // await AsyncStorage.removeItem(Strings.USER_STORAGE);
        userStr = await AsyncStorage.getItem(Strings.USER_STORAGE);
      } catch (e) {
        // Restoring token failed
      }

      try {
        if (theme) {
          setThemeReducer(JSON.parse(theme));
          setActiveTheme(JSON.parse(theme).theme);
        }
      } catch (err) {
        console.log(`theme: ${theme}`);
      }

      try {
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
      } catch (err) {
        console.log(`accounts: ${accounts}`);
      }

      try {
        if (paypoints) {
          // console.log(paypoints);
          paypoints = paypoints == "undefined" ? [] : JSON.parse(paypoints);

          setPayPoints(JSON.parse(paypoints));
        }
      } catch (er) {}

      try {
        if (paymentHistory) {
          setPaymentHistory(
            JSON.parse(paymentHistory).map((ph: any) => new PaymentHistory(ph))
          );
        }
      } catch (err) {
        console.log(`paymentHistory: ${paymentHistory}`);
      }

      try {
        // console.log(billGroups)
        if (billGroups) {
          setBillGroups(JSON.parse(billGroups));
        } else {
          const { status, data } = await fetchAllBillGroups();
          if (status === 200 && data.success) {
            const pay: BillGroupReducerI = {};
            data.payload.recordset.forEach((bg) => (pay[bg.GROUP_ID] = bg));
            setBillGroups(pay);
          }
        }
      } catch (er) {
        console.log(`notifications: ${notifications}`);
      }

      try {
        if (bookNumbers) {
          const data: BookNumberReducerI = JSON.parse(bookNumbers);
          Object.keys(data).forEach((key) => {
            let bns = data[key];

            bns.map((k) => new BookNumber(k)); // forEach((k) => (bns.CODE = new BookNumber(bns[k])));
          });
          setBookNumbers(data);
        }
      } catch (err) {
        console.log(`bookNumbers: ${bookNumbers}`);
      }

      try {
        if (accessNotes) {
          setAccessNotes(JSON.parse(accessNotes));
        }
      } catch (err) {
        console.log(`accessNotes: ${accessNotes}`);
      }

      try {
        if (activeAccount) {
          setActiveAccount(JSON.parse(activeAccount));
        }
      } catch (err) {
        console.log(`activeAccount: ${activeAccount}`);
      }

      try {
        if (notifications) {
          setNotifications(
            JSON.parse(notifications).map(
              (item: NotificationI) => new Notification(item)
            )
          );
        }
      } catch (err) {
        console.log(`userStr: ${notifications}`);
      }

      try {
        if (userStr) {
          const userReducer: UserReducerI = JSON.parse(userStr);
          const created = userReducer.createdAt + 60 * 60 * 24 * 1000;
          const now = Date.now();
          if (created > now) {
            setUserReducer(userReducer);
          } else {
            setUserReducer({
              username: "",
              manNumber: "",
              authToken: "",
              createdAt: 0,
            });
          }
        }
      } catch (err) {
        console.log(`userStr: ${userStr}`);
      }
    }

    setLoading(false);
  };

  const getConfigStatus = async () => {
    const { status, data } = await fetchConfigStatus();

    return !(
      status == 200 &&
      data.success &&
      !/deprecated/i.test(data.payload.status)
    );
  };

  useEffect(() => {
    let is_subscribed = true;

    if (is_subscribed) {
      try {
        bootstrapAsync();
      } catch (err) {
        const { title, message } = Strings.SELF_REPORTING_PROBLEM;
        Alert.alert(title, message, [{ onPress: () => BackHandler.exitApp() }]);
      }
    }
    return () => {
      is_subscribed = false;
    };
  }, []);

  return (
    <Stack.Navigator headerMode="none" initialRouteName="Loader">
      {loading ? (
        <Stack.Screen name="Loader" component={Loader} />
      ) : deprecated ? (
        <Stack.Screen
          name={Strings.DeprecationScreen}
          component={DeprecationScreen}
        />
      ) : (
        <Stack.Screen
          options={{ headerShown: false }}
          name="Stack Navigator"
          component={StackNavigator}
        />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
  },
  surface: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    alignSelf: "center",
    borderRadius: 10,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    paddingRight: 10,
    paddingBottom: 10,
  },
});

const mapStateProps = ({ billGroups, theme }: RootReducerI) => ({
  billGroups,
  themeReducer: theme,
});

const matchDispatchToProps = (dispatch: any) =>
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

export default connect(mapStateProps, matchDispatchToProps)(Bootstrap);
