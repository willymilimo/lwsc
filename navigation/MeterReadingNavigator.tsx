import React from "react";
import { connect } from "react-redux";
import { RootReducerI } from "../redux/reducers";
import { UserReducerI } from "../redux/reducers/user";
import { createStackNavigator } from "@react-navigation/stack";
import SelectAreaScreen from "../screens/SelectAreaScreen";
import Strings from "../constants/Strings";
import SignInScreen from "../screens/SignInScreen";
import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const Stack = createStackNavigator();

interface PropI {
  user: UserReducerI;
}
const MeterReadingNavigator = ({ user }: PropI) => {
  const navigator = useNavigation();
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
        headerRight: ({ tintColor }) => (
          <IconButton
            icon={() => (
              <Ionicons
                onPress={() => navigator.navigate(Strings.HomeTabNavigator)}
                style={{ marginRight: 10 }}
                size={25}
                color={tintColor}
                name={`${Platform.OS === "ios" ? "ios" : "md"}-home`}
              />
            )}
            color={tintColor}
          />
        ),
      }}
    >
      {user.authToken === "" ||
      user.createdAt === 0 ||
      user.manNumber === "" ? (
        // No token found, user isn't signed in
        <>
          <Stack.Screen
            name={Strings.SignInScreen}
            component={SignInScreen}
            options={{
              title: "Sign in",
              // When logging out, a pop animation feels intuitive
              // You can remove this if you want the default 'push' animation
              animationTypeForReplace:
                user.authToken === "" ||
                user.createdAt === 0 ||
                user.manNumber === ""
                  ? "pop"
                  : "push",
            }}
          />
          <Stack.Screen
            name={Strings.SelectAreaScreen}
            component={SelectAreaScreen}
            initialParams={{ toRoute: Strings.SelectAreaScreen }}
          />
        </>
      ) : (
        // User is signed in
        <Stack.Screen
          name={Strings.SelectAreaScreen}
          component={SelectAreaScreen}
          initialParams={{ toRoute: Strings.SelectAreaScreen }}
        />
      )}
    </Stack.Navigator>
  );
};

const mapStateToProps = ({ user }: RootReducerI) => ({ user });

export default connect(mapStateToProps)(MeterReadingNavigator);
