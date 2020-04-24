import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import ServicesScreen from "../screens/ServicesScreen";
import { connect } from "react-redux";
import { RootReducerI } from "../redux/reducers";
import { ThemeType } from "../types/theme";
import BillsScreen from "../screens/BillsScreen";

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
      <Tab.Screen name="Bills" component={BillsScreen} />
      {/* <Tab.Screen name="Accounts" component={ServicesScreen} /> */}
      <Tab.Screen name="History" component={ServicesScreen} />
    </Tab.Navigator>
  );
};

const mapStateToProps = ({ theme }: RootReducerI) => ({ theme: theme.theme });

export default connect(mapStateToProps)(HomeTabNavigator);
