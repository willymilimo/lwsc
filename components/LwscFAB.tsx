import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import Colors from "../constants/Colors";
import { IconButton } from "react-native-paper";

interface LwscFABIcon {
  name: string;
  type: any;
}

interface LwscFABI {
  onPress?(): void;
  style?: object;
  backgroundColor: string;
  color: string;
  icon: LwscFABIcon;
  label?: string;
  labelStyle?: object;
  visible?: boolean;
}

const LwscFAB = ({
  onPress,
  style,
  backgroundColor,
  color,
  icon,
  label,
  labelStyle,
  visible = true,
}: LwscFABI) => {
  const { buttonStyle, textStyle } = styles;
  return (
    <Animated.View
      style={[
        buttonStyle,
        style,
        {
          width: 50,
          height: 50,
          backgroundColor: backgroundColor,
          borderColor:
            backgroundColor === Colors.whiteColor ? color : backgroundColor,
        },
        !visible ? { right: -1000 } : {},
      ]}
    >
      {label && (
        <Text
          numberOfLines={1}
          style={[
            textStyle,
            {
              backgroundColor: `${backgroundColor}11`,
              borderRadius: 5,
              borderWidth: 0.5,
              borderColor: `${backgroundColor}33`,
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
      <IconButton
        icon={({ size, color }) => (
          <icon.type name={icon.name} color={color} size={23} />
        )}
        color={color}
        onPress={onPress}
      />
    </Animated.View>
  );
};

export default LwscFAB;

const styles = StyleSheet.create({
  buttonStyle: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    position: "absolute",
    bottom: 15,
    right: 25,
    borderWidth: 0.5,
    borderColor: Colors.linkBlue,
    backgroundColor: `${Colors.linkBlue}22`,
    zIndex: 999,
  },
  textStyle: {
    position: "absolute",
    right: 60,
    padding: 10,
  },
});
