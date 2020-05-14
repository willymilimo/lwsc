import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { InputItemType } from "../types/input-item";
import { TextInput, Button } from "react-native-paper";
import Colors from "../constants/Colors";

const LodgeComplaintScreen = () => {
  const { container, buttonStyle } = styles;
  const [loading, setLoading] = React.useState(false);
  const [fullName, setFullName] = React.useState<InputItemType<string>>({
    value: "",
    error: false,
  });
  const [message, setMessage] = React.useState<InputItemType<string>>({
    value: "",
    error: false,
  });

  return (
    <View style={container}>
      <TextInput
        disabled={loading}
        autoFocus={true}
        mode="outlined"
        label={"Full Name"}
        value={fullName.value}
        error={fullName.error}
        onChangeText={(value) => setFullName({ value, error: false })}
      />
      <TextInput
        style={{ marginTop: 15 }}
        disabled={loading}
        mode="outlined"
        label={"Account/Meter Number"}
        value={fullName.value}
        error={fullName.error}
        onChangeText={(value) => setFullName({ value, error: false })}
      />
      <TextInput
        style={{ marginTop: 15 }}
        disabled={loading}
        mode="outlined"
        label={"Phone Number"}
        placeholder="e.g. +2609548900"
        value={fullName.value}
        error={fullName.error}
        onChangeText={(value) => setFullName({ value, error: false })}
      />
      <TextInput
        disabled={loading}
        style={{ marginTop: 15 }}
        multiline={true}
        numberOfLines={10}
        mode="outlined"
        label={"Your complaint"}
        value={message.value}
        error={message.error}
        onChangeText={(value) => setMessage({ value, error: false })}
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
        loading={loading}
        icon="send"
        mode="outlined"
        onPress={() => {}}
      >
        Submit
      </Button>
    </View>
  );
};

export default LodgeComplaintScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  buttonStyle: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    position: "absolute",
    bottom: 15,
    right: 15,
    borderWidth: 0.5,
    borderColor: Colors.linkBlue,
    backgroundColor: `${Colors.linkBlue}22`,
    zIndex: 999,
  },
});
