import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import store from "./redux/store";
import StackNavigator from "./navigation/StackNavigator";
import * as Sentry from "sentry-expo";
import { navigationRef } from "./navigation/RootNavigation";
import { StatusBar } from "react-native";
import Colors from "./constants/Colors";

Sentry.init({
  dsn:
    "https://420c505c0fcd4c99b674c76a37a05174@o429442.ingest.sentry.io/5376037",
  enableInExpoDevelopment: true,
  debug: true,
});

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer ref={navigationRef}>
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
