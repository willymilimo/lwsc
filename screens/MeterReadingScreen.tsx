import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Colors from "../constants/Colors";
import { TextInput, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Strings from "../constants/Strings";

const MeterReadingScreen = () => {
  const navigator = useNavigation();
  const [manNumber, setManNumber] = useState({
    value: "",
    error: false,
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={{ marginTop: 10 }}
        mode="outlined"
        label="Employee Man Number"
        placeholder="e.g. 10239912"
        value={manNumber.value}
        error={manNumber.error}
        onChangeText={(value) => {
          setManNumber({
            value,
            error: !/^[a-z0-9]+([\-/][a-z0-9]+)?$/gi.test(value),
          });
        }}
      />
      <Button
        style={{ marginTop: 15 }}
        contentStyle={{
          borderColor: Colors.linkBlue,
          borderWidth: 0.75,
          borderRadius: 5,
          backgroundColor: `${Colors.linkBlue}22`,
        }}
        color={`${Colors.LwscBlue}bb`}
        disabled={manNumber.value.length === 0 || manNumber.error}
        mode="outlined"
        onPress={() =>
          navigator.navigate(Strings.BillGroupScreen, {
            manNumber: manNumber.value,
          })
        }
      >
        Continue
      </Button>
    </View>
  );
};

export default MeterReadingScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
    paddingHorizontal: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
