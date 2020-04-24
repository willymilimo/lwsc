import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import store from "./redux/store";
import StackNavigator from "./navigation/StackNavigator";
import { StatusBar } from "react-native";

import Colors from "./constants/Colors";

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <StatusBar
            backgroundColor={`${Colors.LwscBlue}cc`}
            barStyle="light-content"
          />
          <StackNavigator />
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}
