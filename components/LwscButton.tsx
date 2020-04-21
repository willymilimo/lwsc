import React from "react";
import Layouts from "../constants/Layouts";
import Colors from "../constants/Colors";
import { Button } from "react-native-paper";
import { StyleSheet } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";

interface LwscButtonI {
  onPress(): void;
  height?: number;
  width?: number;
  shadowColor?: string;
  content: JSX.Element;
  borderSize?: number;
  radius?: number;
  style?: object;
}

const LwscButton = ({
  onPress,
  height,
  width,
  shadowColor,
  content,
  borderSize,
  radius,
  style,
}: LwscButtonI) => {
  style = style || {};
  const { container } = styles;
  return (
    <TouchableHighlight
      onPress={onPress}
      underlayColor="#55555533"
      style={[container, height ? { height } : {}, width ? { width } : {}]}
    >
      {content}
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginBottom: 25,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: Colors.LwscBlue,

    elevation: 5,

    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.75,
    shadowRadius: 3,
  },
});

export default LwscButton;
