import React, { useEffect } from "react";
import { StyleSheet, View, Platform, Text, Alert } from "react-native";
import {
  Portal,
  TextInput,
  RadioButton,
  Button,
  Dialog,
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
import { Prepaid } from "../models/prepaid";
import { setActiveAccount } from "../redux/actions/active-account";
import { ActiveAccountReducerI } from "../redux/reducers/active-account";
import { PropertyI, Property } from "../models/meter-reading";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

interface MakePaymentScreenI {
  accounts: AccountReducerI;
  activeAccount: string;
  addAccount(account: AccountI): void;
  addAccountProperty(property: PropertyI): void;
  deleteAccount(meter_account_no: string | number): void;
  setActiveAccount(activeAccount: ActiveAccountReducerI): void;
}

const MakePaymentScreen = ({
  accounts,
  addAccount,
  addAccountProperty,
  deleteAccount,
  setActiveAccount,
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
    const keys = Object.keys(accounts);
    if (is_subscribed && keys.length) {
      const updateAccounts = async () => {
        setLoading(true);
        for (let i = 0; i < keys.length; i++) {
          const accnt = keys[i];
          try {
            const { data, status } = await getCustomerByAccountNumber(
              accnt,
              AddType.account
            );
            if (status === 200 && data.success) {
              addAccount(
                new Account({
                  ...data.payload,
                  IS_METERED: type == AddType.meter,
                })
              );
            } else {
              deleteAccount(accnt);
            }
          } catch (exc) {
            Alert.alert(
              Strings.SELF_REPORTING_PROBLEM.title,
              Strings.SELF_REPORTING_PROBLEM.message
            );
            break;
          }
        }
        setLoading(false);
      };

      updateAccounts();
    }

    return () => {
      is_subscribed = false;
    };
  }, []);

  const handleAccountMeterSubmit = async () => {
    if (type === AddType.meter) {
      setShowDialog(false);
      setMeterAccountNo("");
      navigator.navigate(
        Strings.PaymentMethodScreen,
        new Prepaid({
          meterNumber: meterAccountNo,
        })
      );
    } else if (meterAccountNo.length) {
      if (!Object.keys(accounts).includes(meterAccountNo)) {
        setLoading(true);

        try {
          const promise =
            type === AddType.account
              ? await getCustomerByAccountNumber(meterAccountNo)
              : await getCustomerByMeterNumber(meterAccountNo);

          const { status, data } = promise;

          if (status === 200 && data.success) {
            setMeterAccountNo("");
            setActiveAccount({ [meterAccountNo]: type });
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
          const { title, message } = Strings.SELF_REPORTING_PROBLEM;
          Alert.alert(title, message, [
            { onPress: () => navigator.navigate(Strings.HomeTabNavigator) },
          ]);
        }
        setLoading(false);
      } else {
        Alert.alert(
          `${type} Already Added`,
          `The specified ${type} number has already been added to your profile. Select it from the list of added ${type.toLowerCase()} numbers.`
        );
      }
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
            payItems.map((acc) => (
              <BillComponent
                key={`${acc.CUSTKEY} - ${acc.ID_NO} - ${acc.CUSTOMER_ID}`}
                account={acc}
                onPress={() =>
                  navigator.navigate(Strings.PaymentMethodScreen, acc)
                }
              />
            ))
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
                  backgroundColor: `${Colors.linkBlue}22`,
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
              <RadioButton.Group
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
                disabled={loading}
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
          labelStyle={{ backgroundColor: Colors.whiteColor, width: 145 }}
          icon={{
            name: `${Platform.OS === "ios" ? "ios" : "md"}-add`,
            type: Ionicons,
          }}
          style={{ bottom: 75 }}
          backgroundColor={Colors.LwscBlue}
          color="white"
        />
        <LwscFAB
          visible={!showDialog}
          onPress={() => {
            setIsBuyForAnother(true);
            setShowDialog(true);
          }}
          label="Pay for Another"
          labelStyle={{ backgroundColor: Colors.whiteColor, width: 120 }}
          icon={{
            name: `hands-helping`,
            type: FontAwesome5,
          }}
          backgroundColor={Colors.LwscBlue}
          color="white"
        />
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
      deleteAccount,
      setActiveAccount,
      addAccountProperty,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(MakePaymentScreen);

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
    padding: 10,
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
  gradientStyle: {
    display: "flex",
    flex: 1,
  },
});
