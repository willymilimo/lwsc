import React, { useState } from "react";
import { StyleSheet, Text, View, KeyboardType } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Colors from "../constants/Colors";
import { TextInput, Colors as RNPColor } from "react-native-paper";
import { toFixed } from "../helpers/functions";

interface LwscTextInputI {
  prefixStyle?: object;
  textInputStype?: object;
  prefix: string;
  loading?: boolean;
  label?: string;
  placeholder?: string;
  keyboardType?: KeyboardType;
  money?: boolean;
  validator?: RegExp;
  onChangeText(text: string): void;
}

const LwscTextInput = ({
  prefixStyle,
  prefix,
  loading,
  onChangeText,
  label,
  placeholder,
  textInputStype,
  keyboardType,
  money,
  disabled,
  validator,
}: LwscTextInputI) => {
  let textInputRef: any;
  const { flexRow } = styles;
  const [value, setValue] = useState<{ value: string; error: boolean }>({
    value: "",
    error: false,
  });
  const [textInputActive, setTextInputActive] = useState(false);
  validator = validator || /(.*?)/;

  return (
    <TouchableWithoutFeedback
      style={[
        flexRow,
        value.error ? { borderColor: RNPColor.redA700, borderWidth: 2.5 } : {},
      ]}
      onPress={() => {
        setTextInputActive(true);
        textInputRef.focus();
      }}
    >
      <Text
        style={[
          { fontSize: 18 },
          value.value !== "" || textInputActive ? { marginTop: 20 } : {},
          prefixStyle,
        ]}
      >
        {prefix}
      </Text>
      <TextInput
        ref={(ref) => (textInputRef = ref)}
        label={label}
        keyboardType={keyboardType}
        placeholder={placeholder}
        value={value.value}
        error={value.error}
        disabled={loading}
        underlineColor="#fff"
        style={[{ backgroundColor: "white", flex: 1 }, textInputStype]}
        onFocus={() => {
          setTextInputActive(true);
          if (money && value.value.length) {
            setValue({
              value: value.value.replace(",", "").replace(/.00$/g, ""),
              error: value.error,
            });
          }
        }}
        onBlur={() => {
          setTextInputActive(false);
          setValue({
            value: toFixed(value.value),
            error: value.error,
          });
        }}
        onChangeText={(text) => {
          onChangeText(text);
          setValue({
            value: text,
            error: !(validator as RegExp).test(text),
          });
        }}
      />
    </TouchableWithoutFeedback>
  );
};

export default LwscTextInput;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    borderRadius: 5,
    borderColor: `${Colors.LwscBlack}55`,
    borderWidth: 1.5,
    paddingHorizontal: 10,
  },
});
