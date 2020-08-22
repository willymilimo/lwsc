import React, { useEffect, useState } from "react";
import { View, Text, AsyncStorage, StyleSheet } from "react-native";
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
import { fetchAllBillGroups } from "../models/axios";

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
  const [loading, setLoading] = useState(false);

  const bootstrapAsync = async () => {
    setLoading(true);
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
      accounts = await AsyncStorage.getItem(Strings.ACCOUNTS_STORAGE);
      paypoints = await AsyncStorage.getItem(Strings.PAYPOINTS_STORAGE);
      paymentHistory = await AsyncStorage.getItem(
        Strings.PAYMENT_HISTORY_STORAGE
      );

      notifications = await AsyncStorage.getItem(Strings.NOTIFICATIONS_STORAGE);
      // await AsyncStorage.removeItem(Strings.NOTIFICATIONS_STORAGE)
      // await AsyncStorage.removeItem(Strings.MR_PROPERTY_STORAGE)
      billGroups = await AsyncStorage.getItem(Strings.BILL_GROUP_STORAGE);
      bookNumbers = await AsyncStorage.getItem(Strings.BOOK_NUMBER_STORAGE);
      // properties = await AsyncStorage.getItem(Strings.MR_PROPERTY_STORAGE);

      // await AsyncStorage.removeItem(Strings.ACCESS_NOTES_STORAGE)
      accessNotes = await AsyncStorage.getItem(Strings.ACCESS_NOTES_STORAGE);

      activeAccount = await AsyncStorage.getItem(
        Strings.ACTIVE_ACCOUNT_STORAGE
      );

      pushTokenStr = await AsyncStorage.getItem(Strings.PUSH_TOKEN_STORAGE);
      // console.log(pushTokenStr)

      // await AsyncStorage.removeItem(Strings.USER_STORAGE);
      userStr = await AsyncStorage.getItem(Strings.USER_STORAGE);
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

    if (bookNumbers) {
      const data: BookNumberReducerI = JSON.parse(bookNumbers);
      Object.keys(data).forEach((key) => {
        let bns = data[key];

        bns.map((k) => new BookNumber(k)); // forEach((k) => (bns.CODE = new BookNumber(bns[k])));
      });
      setBookNumbers(data);
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

    // console.log(`pushTokenStr: ${pushTokenStr}`);
    // if (pushTokenStr) {
    //   setPushToken(pushTokenStr);
    //   setToken(pushTokenStr);
    // }

    // setBootstrapping(false);
    setLoading(false);
  };

  useEffect(() => {
    let is_subscribed = true;

    if (is_subscribed) {
      bootstrapAsync();
    }
    return () => {
      is_subscribed = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
    // paddingHorizontal: 15,
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
