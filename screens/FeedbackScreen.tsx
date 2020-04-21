import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-paper";

const FeedbackScreen = () => {
  const { container } = styles;
  const [fullName, setFullName] = React.useState("");
  const [message, setMessage] = React.useState("");
  return (
    <View style={container}>
      <TextInput
        autoFocus={true}
        mode="outlined"
        label={"Full Name"}
        value={fullName}
        onChangeText={(value) => setFullName(value)}
      />
      <TextInput
        style={{ marginTop: 10 }}
        multiline={true}
        numberOfLines={10}
        mode="outlined"
        label={"Your feedback"}
        value={message}
        // helperText={"There is an error"}
        error={true}
        onChangeText={(value) => setMessage(value)}
      />
    </View>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
});
