import React from "react";
import { StyleSheet, Text, View, StatusBar, SafeAreaView } from "react-native";
import { Appbar, Badge, IconButton, Paper } from "material-bread";
import Colors from "../constants/Colors";
import Layouts from "../constants/Layouts";

const PaymentMethodScreen = () => {
  const { container } = styles;
  return (
    <SafeAreaView style={container}>
      <StatusBar />
      <Appbar
        style={{ borderBottomWidth: 0.75, borderBottomColor: "#00000033" }}
        color="transparent"
        elevation={0}
        titleStyles={{ color: Colors.LwscBlackLighter }}
        // actionItemsStyle={{color: Colors.PrimaryColor}},
        barType={"normal"}
        title={"Payment"}
        navigation={
          <IconButton name="menu" size={24} color={Colors.LwscBlackLighter} />
        }
        onNavigation={() => console.log("onNavigation!")}
        actionItems={[
          { name: "more-vert" },
          <Badge
            containerStyle={{
              marginRight: 16,
              flex: 1,
              backgroundColor: "red",
            }}
            color={"#e10050"}
            textColor={"white"}
            size={14}
            content={77}
          >
            <IconButton
              name="notifications"
              size={24}
              color={Colors.LwscBlackLighter}
            />
          </Badge>,
          //   { name: "search", onPress: () => console.log("onSearch") },
        ]}
      />
      <Paper
        style={{
          height: 150,
          width: Layouts.window.width - 30,
          marginVertical: 15,
          borderRadius: 10,
          alignItems: "center",
          alignSelf: "center",
        }}
        elevation={2}
      ></Paper>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
  },
});
