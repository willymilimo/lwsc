import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextField } from "material-bread";

const FeedbackScreen = () => {
  const { container } = styles;
  const [fullName, setFullName] = React.useState("");
  const [message, setMessage] = React.useState("");
  return (
    <View style={container}>
      <TextField
        type={"outlined"}
        label={"Full Name"}
        value={fullName}
        onChangeText={(value) => setFullName(value)}
      />
      <TextField
        containerStyle={{ marginTop: 20 }}
        multiline={true}
        type={"outlined"}
        label={"Your feedback"}
        value={message}
        helperText={"There is an error"}
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
