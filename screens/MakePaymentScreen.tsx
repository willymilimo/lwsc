import React from "react";
import { StyleSheet, View, Platform, Alert } from "react-native";
import {
  Portal,
  Text,
  Button,
  Dialog,
  TextInput,
  RadioButton,
} from "react-native-paper";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

import Colors from "../constants/Colors";
import LwscFAB from "../components/LwscFAB";
import { RootReducerI } from "../redux/reducers";
import { addAccount, deleteAccount } from "../redux/actions/accounts";
import { AccountI, Account } from "../models/account";
import { getCustomerByAccountNumber } from "../models/axios";
import { AddType } from "../types/add-type";
import Strings from "../constants/Strings";
import { AccountReducerI } from "../redux/reducers/accounts";
import BillComponent from "../components/BillComponent";
import { NavType } from "../types/nav-type";

interface MakePaymentScreenI {
  navigation: NavType;
  accounts: AccountReducerI;
  addAccount(account: AccountI): void;
  deleteAccount(meter_account_no: string | number): void;
}

const MakePaymentScreen = ({
  navigation,
  accounts,
  addAccount,
  deleteAccount,
}: MakePaymentScreenI) => {
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

  const handleAccountMeterSubmit = () => {
    if (meterAccountNo.length) {
      if (!Object.keys(accounts).includes(meterAccountNo)) {
        setLoading(true);
        getCustomerByAccountNumber(meterAccountNo, type)
          .then((response) => {
            const { data } = response;
            // console.log(data)

            if (data.success) {
              addAccount(
                new Account({
                  ...data.payload,
                  IS_METERED: type == AddType.meter,
                })
              );
              setShowDialog(false);
              setMeterAccountNo("");
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
          })
          .catch((err) => {
            Alert.alert(
              Strings.REPORT_PROBLEM.title,
              Strings.REPORT_PROBLEM.message,
              [{ onPress: () => {}, text: "Report" }]
            );
          })
          .finally(() => setLoading(false));
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
      <ScrollView style={box}>
        {payItems.length ? (
          payItems.map((acc) => (
            <BillComponent
              key={`${acc.CUSTKEY} - ${acc.ID_NO} - ${acc.CUSTOMER_ID}`}
              account={acc}
              onPress={() =>
                navigation.navigate(Strings.PaymentMethodScreen, acc)
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
        labelStyle={{ width: 145 }}
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
        labelStyle={{ width: 120 }}
        icon={{
          name: `hands-helping`,
          type: FontAwesome5,
        }}
        backgroundColor={Colors.LwscBlue}
        color="white"
      />
    </View>
  );
};

const mapStateToProps = ({ accounts }: RootReducerI) => ({ accounts });

const matchDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      addAccount,
      deleteAccount,
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
});
