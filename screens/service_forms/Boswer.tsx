import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { TextInput, Button, RadioButton, Colors } from "react-native-paper";
import { ControlI } from "../../models/control";
import Regex from "../../constants/Regex";
import { NavType } from "../../types/nav-type";
import Strings from "../../constants/Strings";
import LwscTextInput from "../../components/LwscTextInput";
import { RootReducerI } from "../../redux/reducers";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { toFixed } from "../../helpers/functions";
import { DeliveryType } from "../../types/delivery-type";
import { Bowser } from "../../models/bowser";

interface BoswerI {
  navigation: NavType;
  costPerLitre: number;
}

const BoswerForm = ({ navigation, costPerLitre }: BoswerI) => {
  const { container, flexRow, radioLabelStyle, headerStyle } = styles;
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
  const [deliveryType, setDeliveryType] = useState<DeliveryType>(
    DeliveryType["By LWSC"]
  );
  const [litres, setLitres] = useState<number>(0);

  return (
    <ScrollView style={container}>
      <Text style={headerStyle}>Collection Method</Text>
      <RadioButton.Group
        onValueChange={(value) => setDeliveryType(value as DeliveryType)}
        value={deliveryType}
      >
        <View style={flexRow}>
          <View style={flexRow}>
            <Text style={radioLabelStyle}>By LWSC</Text>
            <RadioButton color="#3366cc" value={DeliveryType["By LWSC"]} />
          </View>
          <View style={flexRow}>
            <Text style={radioLabelStyle}>Self Collection</Text>
            <RadioButton
              color="#3366cc"
              value={DeliveryType["Self Collection"]}
            />
          </View>
        </View>
      </RadioButton.Group>

      <TextInput
        style={{ marginTop: 0, backgroundColor: "white" }}
        mode="outlined"
        label="Customer Name"
        keyboardType="name-phone-pad"
        placeholder={`e.g. Covid Banda`}
        value={fullName.value as string}
        error={fullName.error}
        disabled={loading}
        onChangeText={(text) =>
          setFullName({
            value: text,
            error: text.trim().length < 5,
          })
        }
      />

      <TextInput
        style={{ marginTop: 10, backgroundColor: "white" }}
        mode="outlined"
        label="Phone Number"
        keyboardType="phone-pad"
        placeholder={`e.g. +260950003929`}
        value={phone.value as string}
        error={phone.error}
        disabled={loading}
        onChangeText={(text) =>
          setPhone({
            value: text,
            error: text.trim().length < 9,
          })
        }
      />

      <TextInput
        style={{ marginTop: 10, backgroundColor: "white" }}
        mode="outlined"
        label="Email Address"
        keyboardType="email-address"
        placeholder={`e.g. example@lwsc.co.zm`}
        value={email.value as string}
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
        style={{ marginTop: 10, backgroundColor: "white" }}
        multiline={true}
        numberOfLines={5}
        mode="outlined"
        label="Address"
        placeholder={`e.g. Plot. 5 Off Chilimbulu Road, Chilenje, Lusaka`}
        value={address.value as string}
        error={address.error}
        disabled={loading}
        onChangeText={(text) =>
          setAddress({
            value: text,
            error: text.trim().length < 9,
          })
        }
      />

      <LwscTextInput
        style={{ marginTop: 10, backgroundColor: "white" }}
        onChangeText={(text) => setLitres(parseFloat(text))}
        keyboardType="numeric"
        suffix="Litres"
        label="Number of Litres"
        validator={/^\d+$/}
        loading={loading}
      />

      <View style={[flexRow, { marginTop: 10 }]}>
        <Text>Unit Price</Text>
        <Text
          style={{ fontWeight: "bold", color: Colors.red800 }}
        >{` ZMW ${toFixed(costPerLitre)} `}</Text>
        <Text>per Litre</Text>
      </View>
      <View style={flexRow}>
        <Text>Total Price</Text>
        <Text
          style={{ fontWeight: "bold", color: Colors.red800 }}
        >{` ZMW ${toFixed(costPerLitre * litres)}`}</Text>
      </View>

      <Button
        disabled={
          loading ||
          fullName.error ||
          !(fullName.value as string).length ||
          phone.error ||
          !(phone.value as string).length ||
          email.error ||
          !(email.value as string).length ||
          address.error ||
          !(address.value as string).length ||
          !(deliveryType in DeliveryType) ||
          litres <= 0
        }
        style={{ marginVertical: 20, paddingVertical: 5 }}
        labelStyle={{ fontSize: 17 }}
        mode="contained"
        onPress={() =>
          navigation.navigate(
            Strings.PaymentMethodScreen,
            new Bowser({
              fullName: fullName.value as string,
              phone: phone.value as string,
              email: email.value as string,
              address: address.value as string,
              litres,
              deliveryType,
            })
          )
        }
      >
        Make Payment
      </Button>
    </ScrollView>
  );
};

const mapStateToProps = ({ serviceConstants }: RootReducerI) => ({
  costPerLitre: serviceConstants.costPerLitre,
});



export default connect(mapStateToProps)(BoswerForm);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    paddingHorizontal: 15,
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    marginLeft: 8,
  },
  radioLabelStyle: {
    fontSize: 15,
  },
  headerStyle: {
    marginTop: 20,
    fontStyle: "italic",
    fontSize: 15,
    fontWeight: "600",
  },
});
