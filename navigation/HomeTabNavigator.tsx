import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
import { RootReducerI } from "../redux/reducers";
import { ThemeType } from "../types/theme";
import HomeScreen from "../screens/HomeScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import ManageAccountsScreen from "../screens/ManageAccountsScreen";

interface HTNI {
  route: any;
  theme: ThemeType;
}

type HTNT = HTNI;

const Tab = createBottomTabNavigator();

const HomeTabNavigator = ({ route, theme }: HTNT) => {
  const [activeTheme, setActiveTheme] = React.useState(theme);
  const initialRouteName = (route.params && route.params.screen) || "Home";

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
      initialRouteName={initialRouteName}
      screenOptions={({ route }: any) => ({
        tabBarIcon: ({ focused, color, size }: any) => {
          let iconName = "";

          if (route.name === "Home") {
            iconName = `${focused ? "ios" : "md"}-home`;
          } else if (route.name === "Notifications") {
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
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Accounts" component={ManageAccountsScreen} />
      {/* <Tab.Screen name="History" component={PaymentHistoryScreen} /> */}
    </Tab.Navigator>
  );
};

HomeTabNavigator.navigationOptions = {
  header: null,
};

const mapStateToProps = ({ theme }: RootReducerI) => ({ theme: theme.theme });

export default connect(mapStateToProps)(HomeTabNavigator);
