import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeTabNavigator from "./HomeTabNavigator";
import NotificationsScreen from "../screens/NotificationsScreen";
import LocatePaypointScreen from "../screens/LocatePaypointScreen";
import ManageAccounts from "../screens/ManageAccounts";
import PaymentScreen from "../screens/PaymentScreen";
import PaymentMethodScreen from "../screens/PaymentMethodScreen";
import ServicesScreen from "../screens/ServicesScreen";
import Strings from "../constants/Strings";

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName={Strings.HomeTabNavigator}>
      <Stack.Screen
        name={Strings.HomeTabNavigator}
        component={HomeTabNavigator}
      />
      <Stack.Screen
        name={Strings.NotificationsScreen}
        component={NotificationsScreen}
      />
      <Stack.Screen
        name={Strings.LocatePayPointScreen}
        component={LocatePaypointScreen}
      />
      <Stack.Screen
        name={Strings.ManageAccountsScreen}
        component={ManageAccounts}
      />
      <Stack.Screen
        name={Strings.PaymentMethodScreen}
        component={PaymentMethodScreen}
      />
      <Stack.Screen name={Strings.PaymentScreen} component={PaymentScreen} />
      <Stack.Screen name={Strings.ServicesScreen} component={ServicesScreen} />
    </Stack.Navigator>
  );
}
