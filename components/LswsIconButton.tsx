import React from "react";
import { TouchableHighlight } from "react-native-gesture-handler";

interface LIBI {
  onPress(): any;
  style?: object;
  content: JSX.Element;
}

const LswsIconButton = ({ onPress, style, content }: LIBI) => {
  return (
    <TouchableHighlight
      onPress={onPress}
      underlayColor="#55555544"
      style={{
        width: 50,
        height: 50,
        padding: 10,
        borderRadius: 25,
        justifyContent: "center",
      }}
    >
      {content}
    </TouchableHighlight>
  );
};

export default LswsIconButton;
