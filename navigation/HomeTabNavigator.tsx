import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import ServicesScreen from "../screens/ServicesScreen";
import Colors from "../constants/Colors";

const Tab = createBottomTabNavigator();

export default function () {
  return (
    <Tab.Navigator
      screenOptions={({ route }: any) => ({
        tabBarIcon: ({ focused, color, size }: any) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "ios-home" : "md-home";
          } else if (route.name === "Bills") {
            iconName = focused ? "ios-speedometer" : "md-speedometer";
          } else if (route.name === "History") {
            iconName = focused ? "ios-time" : "md-time";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: `${Colors.LwscBlue}`,
        inactiveTintColor: `${Colors.LwscBlue}88`,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bills" component={ServicesScreen} />
      {/* <Tab.Screen name="Accounts" component={ServicesScreen} /> */}
      <Tab.Screen name="History" component={ServicesScreen} />
    </Tab.Navigator>
  );
}
