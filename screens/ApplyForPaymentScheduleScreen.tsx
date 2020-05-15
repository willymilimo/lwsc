import React from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import BillComponent from "../components/BillComponent";
import { NavType } from "../types/nav-type";
import { AccountI } from "../models/account";
import { TextInput, Button } from "react-native-paper";
import { ControlIT } from "../models/control";
import Colors from "../constants/Colors";

interface PaymentMethodScreenI {
  navigation: NavType;
  route: {
    params: AccountI;
  };
}

const ApplyForPaymentScheduleScreen = ({
  navigation,
  route,
}: PaymentMethodScreenI) => {
  const { params } = route;
  const [phone, setPhone] = React.useState<ControlIT<string>>({
    value: "",
    error: false,
  });
  const [email, setEmail] = React.useState<ControlIT<string>>({
    value: "",
    error: false,
  });
  const [loading, setLoading] = React.useState(false);

  return (
    <ScrollView style={styles.container}>
      <BillComponent account={params} />
      <TextInput
        style={{ marginTop: 10, marginHorizontal: 7 }}
        mode="outlined"
        label="Phone Number"
        placeholder="e.g. +260950039290"
        value={phone.value}
        error={phone.error}
        disabled={loading}
        onChangeText={(text) => {}}
      />

      <TextInput
        style={{ marginTop: 8, marginHorizontal: 7 }}
        mode="outlined"
        label="Email Address (optional)"
        placeholder="e.g. mchola@lwsc.co.zm"
        value={email.value}
        error={email.error}
        disabled={loading}
        onChangeText={(text) => {}}
      />

      <Button
        style={{ marginTop: 15, marginHorizontal: 7 }}
        contentStyle={{
          borderColor: Colors.linkBlue,
          borderWidth: 0.75,
          borderRadius: 5,
          backgroundColor: `${Colors.linkBlue}22`,
        }}
        color={`${Colors.LwscBlue}bb`}
        loading={loading}
        //   icon="send"
        mode="outlined"
        onPress={() =>
          Alert.alert(
            "Application Received",
            "You application has been submitted. We will revert to you on the provided phone number and email address"
          )
        }
      >
        APPLY
      </Button>
    </ScrollView>
  );
};

export default ApplyForPaymentScheduleScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "white",
  },
});
