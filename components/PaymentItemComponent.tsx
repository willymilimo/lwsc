import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import { IconButton } from "react-native-paper";
import Colors from "../constants/Colors";
import { PaymentType } from "../types/payment";

interface PICI {
  onPress(name: PaymentType): void;
  backgroundColor: string;
  borderTopWidth: number;
  image: any;
}

const PaymentItemComponent = ({
  onPress,
  backgroundColor,
  borderTopWidth,
  image,
}: PICI) => {
  return (
    <TouchableHighlight
      underlayColor={Colors.lightBorderColor}
      onPress={() => onPress(name)}
      style={{
        marginHorizontal: 10,
        backgroundColor,
      }}
      key={name}
    >
      <View
        style={{
          borderWidth: 0.5,
          borderTopWidth,
          borderColor: Colors.lightGray,
          paddingHorizontal: 10,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <IconButton
            style={{ borderRadius: 25 }}
            size={40}
            icon={({ size, color }) => (
              <Image
                style={{ height: size, width: size }}
                height={size}
                width={size}
                source={image}
              />
            )}
          />
          <Text
            style={{
              fontWeight: "900",
              fontSize: 18,
              color:
                name === checked ? Colors.whiteColor : Colors.LwscBlackLighter,
            }}
          >
            {name}
          </Text>
        </View>
        <RadioButton color="white" uncheckedColor="#3366cc" value={name} />
      </View>
    </TouchableHighlight>
  );
};

export default PaymentItemComponent;

const styles = StyleSheet.create({});
