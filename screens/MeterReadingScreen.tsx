import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Strings from "../constants/Strings";

const MeterReadingScreen = () => {
  const navigator = useNavigation();
  return (
    <View style={styles.container}>
      <Button
        style={{ marginTop: 15 }}
        contentStyle={{
          borderColor: Colors.linkBlue,
          borderWidth: 0.75,
          borderRadius: 5,
          backgroundColor: `${Colors.linkBlue}22`,
        }}
        color={`${Colors.LwscBlue}bb`}
        mode="outlined"
        onPress={() => navigator.navigate(Strings.ReadMeterScreen)}
      >
        Read my Meter
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
        mode="outlined"
        onPress={() => navigator.navigate(Strings.LwscStaffAuthScreen)}
      >
        LWSC STAFF
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
});
