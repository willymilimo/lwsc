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
import HeaderComponent from "../components/HeaderComponent";
import { AsyncStorage } from "react-native";
import { bindActionCreators } from "redux";
import { setThemeReducer } from "../redux/actions/theme";
import { connect } from "react-redux";
import { RootReducerI } from "../redux/reducers";
import { ThemeReducer } from "../types/theme";
import { ActionI } from "../redux/Actions";

const Stack = createStackNavigator();

interface SNI {
  setThemeReducer(themeReducer: ThemeReducer): ActionI;
}

type SNT = SNI;

const StackNavigator = ({ setThemeReducer }: SNT) => {
  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let theme;

      try {
        theme = await AsyncStorage.getItem(Strings.THEME_STORAGE);
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      // dispatch({ type: "RESTORE_TOKEN", token: userToken });
      if (theme) {
        console.log(theme);
        setThemeReducer(JSON.parse(theme));
      }
    };

    bootstrapAsync();
  }, []);

  return (
    <Stack.Navigator
      initialRouteName={Strings.HomeTabNavigator}
      screenOptions={{
        headerStyle: {
          backgroundColor: "red",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        header: ({ scene, previous, navigation }) => {
          const { options } = scene.descriptor;
          const title =
            options.headerTitle !== undefined
              ? options.headerTitle
              : options.title !== undefined
              ? options.title
              : scene.route.name;

          return (
            <HeaderComponent
              title={title}
              navigation={navigation}
              previous={previous}
              style={options.headerStyle}
            />
          );
        },
      }}
    >
      <Stack.Screen
        name={Strings.HomeTabNavigator}
        component={HomeTabNavigator}
        // options={{ headerTitle: (props) => <HeaderComponent {...props} /> }}
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
};

const mapStateToProps = ({ theme }: RootReducerI) => ({ themeReducer: theme });

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      setThemeReducer,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(StackNavigator);
