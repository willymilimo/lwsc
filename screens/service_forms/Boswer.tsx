import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { TextInput, Button } from "react-native-paper";
import { ControlI } from "../../models/control";
import Regex from "../../constants/Regex";
import { NavType } from "../../types/nav-type";
import Strings from "../../constants/Strings";

interface BoswerI {
  navigation: NavType;
}

const Boswer = ({ navigation }: BoswerI) => {
  const { container } = styles;
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState<ControlI>({
    value: "",
    error: false,
  });
  const [phone, setPhone] = useState<ControlI>({
    value: "",
    error: false,
  });
  const [email, setEmail] = useState<ControlI>({
    value: "",
    error: false,
  });
  const [address, setAddress] = useState<ControlI>({
    value: "",
    error: false,
  });

  return (
    <ScrollView style={container}>
      <TextInput
        style={{ marginTop: 10 }}
        mode="outlined"
        label="Full Name"
        keyboardType="name-phone-pad"
        placeholder={`e.g. Covid Banda`}
        value={fullName.value}
        error={fullName.error}
        disabled={loading}
        onChangeText={(text) =>
          setFullName({
            value: text,
            error: !Regex.EMAIL.test(text),
          })
        }
      />
      <TextInput
        style={{ marginTop: 10 }}
        mode="outlined"
        label="Phone Number"
        keyboardType="phone-pad"
        placeholder={`e.g. +260950003929`}
        value={phone.value}
        error={phone.error}
        disabled={loading}
        onChangeText={(text) =>
          setPhone({
            value: text,
            error: !Regex.EMAIL.test(text),
          })
        }
      />
      <TextInput
        style={{ marginTop: 10 }}
        mode="outlined"
        label="Email Address"
        keyboardType="email-address"
        placeholder={`e.g. example@lwsc.co.zm`}
        value={email.value}
        error={email.error}
        disabled={loading}
        onChangeText={(text) =>
          setEmail({
            value: text,
            error: !Regex.EMAIL.test(text),
          })
        }
      />
      <TextInput
        style={{ marginTop: 10 }}
        multiline={true}
        numberOfLines={5}
        mode="outlined"
        label="Address"
        placeholder={`e.g. Plot. 5 Off Chilimbulu Road, Chilenje, Lusaka`}
        value={address.value}
        error={address.error}
        disabled={loading}
        onChangeText={(text) =>
          setEmail({
            value: text,
            error: !Regex.EMAIL.test(text),
          })
        }
      />

      <Button
        disabled={loading || phone.error || email.error || address.error}
        style={{ marginVertical: 20, paddingVertical: 5 }}
        labelStyle={{ fontSize: 17 }}
        mode="contained"
        onPress={() => navigation.navigate(Strings.PaymentMethodScreen)}
      >
        Make Payment
      </Button>
    </ScrollView>
  );
};

export default Boswer;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    paddingHorizontal: 15,
  },
});
