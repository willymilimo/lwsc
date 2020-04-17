import React from "react";
import { Button, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import DrawerContent from "./components/DrawerContent";
import HomeScreen from "./screens/HomeScreen";
import NotificationsScreen from "./screens/NotificationsScreen";

const Drawer = createDrawerNavigator();

export default function DrawerPage() {
  return (
    <NavigationContainer>
      {/* <DrawerContent /> */}
      <Drawer.Navigator
        initialRouteName="Home"
        hideStatusBar={false}
        drawerContent={DrawerContent}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
