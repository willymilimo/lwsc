import React, { useEffect } from "react";
import { StyleSheet, View, Platform, Alert } from "react-native";
import {
  Portal,
  TextInput,
  RadioButton,
  Button,
  Dialog,
  Text,
  FAB,
} from "react-native-paper";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

import Colors from "../constants/Colors";
import LwscFAB from "../components/LwscFAB";
import { RootReducerI } from "../redux/reducers";
import {
  addAccount,
  deleteAccount,
  addAccountProperty,
  addMeterNumber,
} from "../redux/actions/accounts";
import { AccountI, Account } from "../models/account";
import {
  getCustomerByAccountNumber,
  getCustomerByMeterNumber,
} from "../models/axios";
import { AddType } from "../types/add-type";
import Strings from "../constants/Strings";
import { AccountReducerI } from "../redux/reducers/accounts";
import BillComponent from "../components/BillComponent";
import { NavType } from "../types/nav-type";
import {
  setActiveAccount,
  unsetActiveAccount,
} from "../redux/actions/active-account";
import { ActiveAccountReducerI } from "../redux/reducers/active-account";
import { PropertyI, Property } from "../models/meter-reading";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

interface MakePaymentScreenI {
  navigation: NavType;
  accounts: AccountReducerI;
  activeAccount: ActiveAccountReducerI;
  addAccount(account: AccountI): void;
  addMeterNumber(meterNumber: string): void;
  addAccountProperty(property: PropertyI): void;
  deleteAccount(meter_account_no: string | number): void;
  setActiveAccount(activeAccount: ActiveAccountReducerI): void;
  unsetActiveAccount(): void;
}

const ManageAccountScreen = ({
  navigation,
  accounts,
  activeAccount,
  addMeterNumber,
  addAccount,
  addAccountProperty,
  deleteAccount,
  setActiveAccount,
  unsetActiveAccount,
}: MakePaymentScreenI) => {
  const navigator = useNavigation();
  const {
    container,
    box,
    flexRow,
    missingAccount,
    maText,
    radioLabelStyle,
  } = styles;
  const [showDialog, setShowDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [type, setType] = React.useState<AddType>(AddType.account);
  const [isBuyForAnother, setIsBuyForAnother] = React.useState(false);
  const [meterAccountNo, setMeterAccountNo] = React.useState("");
  // const [isPrepaid, setIsPrepaid] = React.useState(false); // we start with

  useEffect(() => {
    let is_subscribed = true;
    const identities = Object.values(accounts);
    // console.log(accounts);
    if (is_subscribed && identities.length) {
      // updateAccount()
      identities.forEach((identity) => {
        if (identity instanceof Account) {
          updateAccount(AddType.account, identity.CUSTKEY);
        } else {
          updateAccount(AddType.meter, identity as string);
        }
      });
    }

    return () => {
      is_subscribed = false;
    };
  }, [accounts]);

  const handleAccountMeterSubmit = async () => {
    await updateAccount(type, meterAccountNo, false);
  };

  const updateAccount = async (
    type: AddType,
    identity: string,
    isInit = true
  ) => {
    if (identity.length) {
      if (!Object.keys(accounts).includes(identity)) {
        if (type === AddType.meter) {
          addMeterNumber(identity);
          setShowDialog(false);
          setMeterAccountNo("");
        } else {
          setLoading(true);

          try {
            const promise =
              type === AddType.account
                ? await getCustomerByAccountNumber(identity)
                : await getCustomerByMeterNumber(identity);

            const { status, data } = promise;

            if (status === 200 && data.success) {
              setMeterAccountNo("");
              setActiveAccount({ [identity]: type });
              const payload = data.payload;

              if (type === AddType.account) {
                addAccount(
                  new Account({
                    ...(payload as AccountI),
                    IS_METERED: false,
                  })
                );
              } else {
                addAccountProperty(new Property(payload as PropertyI));
              }

              setShowDialog(false);
              Alert.alert(
                `${type} Added Successfully`,
                `Your ${type} has been added successfully.`
              );
            } else {
              Alert.alert(
                `${type} not Added`,
                data.error
                  ? data.error.toString()
                  : `Specified ${type} number not found`
              );
            }
          } catch (err) {
            setShowDialog(false);
            const { title, message } = Strings.SELF_REPORTING_PROBLEM;
            Alert.alert(title, message, [
              { onPress: () => navigator.navigate(Strings.HomeTabNavigator) },
            ]);
          }
        }
      } else if (!isInit) {
        Alert.alert(
          `${type} Already Added`,
          `The specified ${type} number has already been added to your profile. Select it from the list of added ${type.toLowerCase()} numbers.`
        );
        setShowDialog(false);
        setMeterAccountNo("");
      }
      setLoading(false);
    }
  };

  const payItems = Object.values(accounts);

  return (
    <View style={container}>
      <LinearGradient
        start={[0, 0]}
        end={[1, 0]}
        colors={["#56cbf1", "#5a86e4"]}
        style={{ display: "flex", flex: 1 }}
      >
        <ScrollView style={box}>
          {payItems.length ? (
            payItems.map((acc) => {
              const isAccount = acc instanceof Account;
              return (
                <View key={Math.random().toString(36).substring(10)}>
                  <FAB
                    style={styles.fab}
                    small
                    icon="delete-forever"
                    onPress={() => {
                      console.log(acc);
                      if (payItems.length === 1) {
                        unsetActiveAccount();
                      }
                      deleteAccount(
                        isAccount
                          ? (acc as AccountI).CUSTKEY
                          : typeof acc === "string"
                          ? acc
                          : (acc as PropertyI).MeterNumber
                      );
                    }}
                  />
                  <BillComponent
                    key={Math.random().toString(36).substring(10)}
                    account={acc}
                    onPress={() =>
                      navigation.navigate(Strings.PaymentMethodScreen, acc)
                    }
                  />
                </View>
              );
            })
          ) : (
            <View style={missingAccount}>
              <Text style={maText}>
                You have not added any account/meter to your profile
              </Text>
              <Button
                style={{ marginTop: 15 }}
                contentStyle={{
                  borderColor: Colors.linkBlue,
                  borderWidth: 0.75,
                  borderRadius: 5,
                  backgroundColor: '#fff',
                }}
                color={`${Colors.LwscBlue}bb`}
                //   loading={loading}
                //   icon="send"
                mode="outlined"
                onPress={() => setShowDialog(true)}
              >
                Add Account/Meter
              </Button>
            </View>
          )}
        </ScrollView>
        <Portal>
          <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
            <Dialog.Title>{`Add ${type}`}</Dialog.Title>
            <Dialog.Content>
              {/* <RadioButton.Group
                onValueChange={(value) => setType(value as AddType)}
                value={type}
              >
                <View style={flexRow}>
                  <View style={flexRow}>
                    <Text style={radioLabelStyle}>Account</Text>
                    <RadioButton color="#3366cc" value={AddType.account} />
                  </View>
                  <View style={flexRow}>
                    <Text style={radioLabelStyle}>Meter</Text>
                    <RadioButton color="#3366cc" value={AddType.meter} />
                  </View>
                </View>
              </RadioButton.Group> */}
              <RadioButton.Group
                onValueChange={(value) => setType(value as AddType)}
                value={type}
              >
                <RadioButton.Item
                  color="#3366cc"
                  label="Account"
                  value={AddType.account}
                />
                <RadioButton.Item
                  color="#3366cc"
                  label="Meter"
                  value={AddType.meter}
                />
              </RadioButton.Group>
              <TextInput
                mode="outlined"
                label={`${type} Number`}
                keyboardType="number-pad"
                value={meterAccountNo}
                disabled={loading}
                autoFocus={true}
                onChangeText={(text) => setMeterAccountNo(text.trim())}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                loading={loading}
                onPress={() => handleAccountMeterSubmit()}
              >
                Submit
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <LwscFAB
          visible={!showDialog}
          onPress={() => {
            setIsBuyForAnother(false);
            setShowDialog(true);
          }}
          label="Add Account/Meter"
          labelStyle={{ backgroundColor: "#fff", width: 145 }}
          icon={{
            name: `${Platform.OS === "ios" ? "ios" : "md"}-add`,
            type: Ionicons,
          }}
          style={{ bottom: 20 }}
          backgroundColor={Colors.LwscBlue}
          color="white"
        />
        {/* <LwscFAB
        visible={!showDialog}
        onPress={() => {
          setIsBuyForAnother(true);
          setShowDialog(true);
        }}
        label="Pay for Another"
        labelStyle={{ width: 120 }}
        icon={{
          name: `hands-helping`,
          type: FontAwesome5,
        }}
        backgroundColor={Colors.LwscBlue}
        color="white"
      /> */}
      </LinearGradient>
    </View>
  );
};

const mapStateToProps = ({ accounts, activeAccount }: RootReducerI) => ({
  accounts,
  activeAccount,
});

const matchDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      addAccount,
      addMeterNumber,
      deleteAccount,
      setActiveAccount,
      addAccountProperty,
      unsetActiveAccount,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(ManageAccountScreen);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  radioLabelStyle: {
    fontSize: 16,
  },
  box: {
    display: "flex",
    flex: 1,
    padding: 15,
  },
  formBox: {
    backgroundColor: "red",
    display: "flex",
    flex: 1,
    height: 100,
    width: 100,
  },
  missingAccount: {
    // backgroundColor: 'pink'
  },
  maText: {
    marginBottom: 10,
  },
  fab: {
    backgroundColor: "red",
    position: "absolute",
    zIndex: 999,
    margin: 16,
    right: -15,
    top: -15,
  },
});
