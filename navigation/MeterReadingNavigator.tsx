import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { RootReducerI } from "../redux/reducers";
import { UserReducerI } from "../redux/reducers/user";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import SelectAreaScreen from "../screens/SelectAreaScreen";
import SignInScreen from "../screens/SignInScreen";
import BillGroupScreen from "../screens/BillGroupScreen";
import BookNumbersScreen from "../screens/BookNumbersScreen";
import PropertiesScreen from "../screens/PropertiesScreen";
import Colors from "../constants/Colors";
import Strings from "../constants/Strings";
import ReadMeterScreen from "../screens/ReadMeterScreen";
import HeaderRightComponent from "./HeaderRightComponent";

const Stack = createStackNavigator();

interface PropI {
  user: UserReducerI;
}
const MeterReadingNavigator = ({ user }: PropI) => {
  const navigator = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(
    user.authToken && user.createdAt && user.manNumber
  );

  useEffect(() => {
    let is_subscribed = true;

    if (is_subscribed) {
      setIsLoggedIn(user.authToken && user.createdAt && user.manNumber);
    }

    return () => {
      is_subscribed = false;
    };
  }, [user]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.LwscBlue,
        },
        headerTintColor: Colors.whiteColor,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerRight: ({tintColor}: any) => <HeaderRightComponent tintColor={tintColor} />,
      }}
    >
      {!isLoggedIn ? (
        // No token found, user isn't signed in
        <>
          <Stack.Screen
            name={Strings.SignInScreen}
            component={SignInScreen}
            options={{
              title: "Sign in",
              // When logging out, a pop animation feels intuitive
              // You can remove this if you want the default 'push' animation
              animationTypeForReplace: !isLoggedIn ? "pop" : "push",
            }}
          />
          <Stack.Screen
            name={Strings.SelectAreaScreen}
            component={SelectAreaScreen}
            initialParams={{ toRoute: Strings.SelectAreaScreen }}
          />
          <Stack.Screen
            name={Strings.PropertiesScreen}
            component={PropertiesScreen}
          />
          <Stack.Screen
            name={Strings.ReadMeterScreen}
            component={ReadMeterScreen}
          />
        </>
      ) : (
        // User is signed in
        <>
          <Stack.Screen
            name={Strings.BillGroupScreen}
            component={BillGroupScreen}
          />
          <Stack.Screen
            name={Strings.BookNumbersScreen}
            component={BookNumbersScreen}
          />
          <Stack.Screen
            name={Strings.PropertiesScreen}
            component={PropertiesScreen}
          />
          <Stack.Screen
            name={Strings.SelectAreaScreen}
            component={SelectAreaScreen}
            initialParams={{ toRoute: Strings.SelectAreaScreen }}
          />
          <Stack.Screen
            name={Strings.ReadMeterScreen}
            component={ReadMeterScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const mapStateToProps = ({ user }: RootReducerI) => ({ user });

export default connect(mapStateToProps)(MeterReadingNavigator);
