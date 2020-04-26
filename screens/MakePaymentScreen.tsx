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
} from "react-native-paper";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../constants/Colors";
import LwscFAB from "../components/LwscFAB";
import { RootReducerI } from "../redux/reducers";
import { addAccount, deleteAccount } from "../redux/actions/accounts";
import { AccountI } from "../models/account";

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
  const [visible, setVisible] = React.useState(false);
  const { container, box, formBox } = styles;
  return (
    <View style={container}>
      <ScrollView style={box}></ScrollView>
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          {/* <Dialog.Title>Meter/Account Number</Dialog.Title> */}
          <Dialog.Content>
            <TextInput
              mode="outlined"
              label="Meter/Account Number"
              value={meterAccountNo}
              onChangeText={(text) => setMeterAccountNo(text)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Submit</Button>
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
});
