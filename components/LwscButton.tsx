import React from "react";
import { GestureResponderEvent } from "react-native";
import { Button } from "material-bread";
import Layouts from "../constants/Layouts";
import Colors from "../constants/Colors";

interface LwscButtonI {
  onPress(e: GestureResponderEvent): void;
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
  return (
    <Button
      fullWidth={true}
      onPress={onPress}
      style={[
        {
          flexDirection: "column",
          padding: 20,
          backgroundColor: "#fff",
          shadowColor: shadowColor || Colors.LwscBlue,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5,
          marginBottom: 25,
          borderColor: "white",
        },
        height ? { height } : {},
        width ? { width } : {},
      ]}
      type={"outlined"}
      borderSize={0}
      radius={10}
    >
      {content}
    </Button>
  );
};

export default LwscButton;
