import React from "react";
import { BreadProvider } from "material-bread";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import store from "./redux/store";
import HomeTabNavigator from "./navigation/HomeTabNavigator";

export default function App() {
  return (
    <Provider store={store}>
      <BreadProvider>
        <NavigationContainer>
          <HomeTabNavigator />
        </NavigationContainer>
      </BreadProvider>
    </Provider>
  );
}
