import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import { connect } from "react-redux";
import { RootReducerI } from "../redux/reducers";
import { ThemeType } from "../types/theme";
import PaymentHistoryScreen from "../screens/PaymentHistoryScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import MakePaymentScreen from "../screens/MakePaymentScreen";

interface HTNI {
  route: any;
  theme: ThemeType;
}

type HTNT = HTNI;

const Tab = createBottomTabNavigator();

const HomeTabNavigator = ({ route, theme }: HTNT) => {
  const [activeTheme, setActiveTheme] = React.useState(theme);

  React.useEffect(() => {
    let is_subscribed = true;

    if (is_subscribed) {
      setActiveTheme(theme);
    }

    return () => {
      is_subscribed = false;
    };
  }, [theme]);

  return (
    <Tab.Navigator
      screenOptions={({ route }: any) => ({
        tabBarIcon: ({ focused, color, size }: any) => {
          let iconName = "";

          if (route.name === "Home") {
            iconName = `${focused ? "ios" : "md"}-home`;
          } else if (route.name === "Notices") {
            iconName = `${focused ? "ios" : "md"}-notifications`;
          } else if (route.name === "Accounts") {
            iconName = `${focused ? "ios" : "md"}-speedometer`;
          } else if (route.name === "History") {
            iconName = `${focused ? "ios" : "md"}-time`;
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: activeTheme.activeTintColor,
        inactiveTintColor: activeTheme.inactiveTintColor,
        activeBackgroundColor: activeTheme.backgroundColor,
        inactiveBackgroundColor: activeTheme.backgroundColor,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={route.params}
      />
      <Tab.Screen name="Notices" component={NotificationsScreen} />
      <Tab.Screen name="Accounts" component={MakePaymentScreen} />
      <Tab.Screen name="History" component={PaymentHistoryScreen} />
    </Tab.Navigator>
  );
};

HomeTabNavigator.navigationOptions = {
  header: null,
};

const mapStateToProps = ({ theme }: RootReducerI) => ({ theme: theme.theme });

export default connect(mapStateToProps)(HomeTabNavigator);
