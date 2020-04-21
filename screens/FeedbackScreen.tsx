import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-paper";

interface InputItemI<T> {
  value: T,
  error: boolean;
}

const FeedbackScreen = () => {
  const { container } = styles;
  const [fullName, setFullName] = React.useState<InputItemI<string>>({value: '', error: false});
  const [message, setMessage] = React.useState<InputItemI<string>>({value: '', error: false});
  return (
    <View style={container}>
      <TextInput
        autoFocus={true}
        mode="outlined"
        label={"Full Name"}
        value={fullName.value}
        error={fullName.error}
        onChangeText={(value) => setFullName({value, error: false})}
      />
      <TextInput
        style={{ marginTop: 10 }}
        multiline={true}
        numberOfLines={10}
        mode="outlined"
        label={"Your feedback"}
        value={message.value}
        error={message.error}
        onChangeText={(value) => setMessage({value, error: false})}
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
