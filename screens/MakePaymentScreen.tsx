import React from "react";
import { StyleSheet, View, Platform, Alert } from "react-native";
import {
  Modal,
  Portal,
  Text,
  Button,
  Provider,
  Dialog,
  Paragraph,
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
import { AccountI } from "../models/account";
import { getCustomerByAccountNumber } from "../models/axios";
import { AddType } from "../types/add-type";
import Strings from "../constants/Strings";

interface MakePaymentScreenI {
  accounts: AccountI[];
  addAccount(account: AccountI): void;
  deleteAccount(meter_account_no: string | number): void;
}

const MakePaymentScreen = ({
  accounts,
  addAccount,
  deleteAccount,
}: MakePaymentScreenI) => {
  const [meterAccountNo, setMeterAccountNo] = React.useState("");
  const {
    container,
    box,
    flexRow,
    missingAccount,
    maText,
    radioLabelStyle,
  } = styles;
  const [visible, setVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [type, setType] = React.useState<AddType>(AddType.account);
  const [myAccounts, setMyAccounts] = React.useState(accounts);

  React.useEffect(() => {
    let is_subscribed = true;

    if (is_subscribed) setMyAccounts(accounts);

    return () => {
      is_subscribed = false;
    };
  }, [accounts]);

  const handleAccountMeterSubmit = () => {
    if (meterAccountNo.length) {
      setLoading(true);
      getCustomerByAccountNumber(meterAccountNo, type)
        .then((response) => {
          const { data } = response;

          if (data.success) {
            addAccount(data.payload);
            Alert.alert(
              `${type} Added Successfully`,
              `Your ${type} has been added successfully.`
            );
          } else {
            Alert.alert(
              `${type} not Added`,
              data.error
                ? data.error.message
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
    }
  };

  return (
    <View style={container}>
      <ScrollView style={box}>
        {myAccounts.length ? (
          myAccounts.map((acc) => (
            <Text key={acc.CUSTKEY}>
              {acc.CUSTKEY}
            </Text>
          ))
        ) : (
          <View style={missingAccount}>
            <Text style={maText}>
              You have not added any account/meter to your profile
            </Text>
            <Button onPress={() => setVisible(true)} mode="contained">
              Add Account/Meter
            </Button>
          </View>
        )}
      </ScrollView>
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
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
              onChangeText={(text) => setMeterAccountNo(text)}
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
        visible={!visible}
        onPress={() => setVisible(true)}
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
        visible={!visible}
        onPress={() => setVisible(true)}
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
