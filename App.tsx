import React from "react";
import { BreadProvider } from "material-bread";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import store from "./redux/store";
import HomeTabNavigator from "./navigation/HomeTabNavigator";
import StackNavigator from "./navigation/StackNavigator";

export default function App() {
  return (
    <Provider store={store}>
      <BreadProvider>
        <NavigationContainer>
          {/* <HomeTabNavigator /> */}
          <StackNavigator />
        </NavigationContainer>
      </BreadProvider>
    </Provider>
  );
}
