import React from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  Portal,
  Dialog,
  RadioButton,
  TextInput,
  Button,
} from "react-native-paper";
import { AddType } from "../../types/add-type";
import { getCustomerByAccountNumber } from "../../models/axios";
import Strings from "../../constants/Strings";
import { Account } from "../../models/account";
import Colors from "../../constants/Colors";
import { useNavigation } from "@react-navigation/native";

const ReConnection = () => {
  const {
    container,
    box,
    flexRow,
    missingAccount,
    maText,
    radioLabelStyle,
  } = styles;
  const [showDialog, setShowDialog] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [type, setType] = React.useState<AddType>(AddType.account);
  const [meterAccountNo, setMeterAccountNo] = React.useState("");
  const [account, setAccount] = React.useState<Account>();
  const navigation = useNavigation();

  const handleAccountMeterSubmit = () => {
    if (meterAccountNo.length) {
      setLoading(true);
      getCustomerByAccountNumber(meterAccountNo, type)
        .then((response) => {
          const { data } = response;

          if (data.success) {
            setAccount(
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
    <ScrollView style={container}>
      <Portal>
        <Dialog visible={showDialog}>
          <Dialog.Title>Add Meter/Account Number</Dialog.Title>
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
              onPress={() => navigation.goBack()}
            >
              Cancel
            </Button>
            <Button
              loading={loading}
              onPress={() => handleAccountMeterSubmit()}
            >
              Submit
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Button
        style={{ marginTop: 15 }}
        contentStyle={{
          borderColor: Colors.linkBlue,
          borderWidth: 0.75,
          borderRadius: 5,
          backgroundColor: `${Colors.linkBlue}22`,
        }}
        color={`${Colors.LwscBlue}bb`}
        loading={loading}
        mode="outlined"
        onPress={() => {}}
      >
        Make Payment
      </Button>

      <Button
        style={{ marginTop: 15 }}
        contentStyle={{
          borderColor: Colors.linkBlue,
          borderWidth: 0.75,
          borderRadius: 5,
          backgroundColor: `${Colors.linkBlue}22`,
        }}
        color={`${Colors.LwscBlue}bb`}
        loading={loading}
        mode="outlined"
        onPress={() =>
          navigation.navigate(Strings.PaymentMethodScreen, account)
        }
      >
        Apply for payment schedule
      </Button>
    </ScrollView>
  );
};

export default ReConnection;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    padding: 10,
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
