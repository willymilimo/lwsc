import React, { useState, useEffect } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import store from "./redux/store";
import * as Sentry from "sentry-expo";
import { navigationRef } from "./navigation/RootNavigation";
import { StatusBar } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import Colors from "./constants/Colors";
import Strings from "./constants/Strings";
import Toast from "./components/Toast";
import Bootstrap from "./navigation/Bootstrap";

Sentry.init({
  dsn:
    "https://420c505c0fcd4c99b674c76a37a05174@o429442.ingest.sentry.io/5376037",
  enableInExpoDevelopment: true,
  debug: true,
});

export default function App() {
  const [internetRecheable, setInternetRecheable] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      // console.log("Connection type", state.type);
      // console.log("Is connected?", state.isConnected);
      setInternetRecheable(!!state.isInternetReachable);
    });
    // To unsubscribe to these update, just use:
    unsubscribe();
  }, []);

  return (
    <Provider store={store}>
      <PaperProvider>
        <>
          <Toast
            visible={!internetRecheable}
            message={Strings.INTERNET_FAILURE.message}
            center={true}
          />
          <NavigationContainer ref={navigationRef}>
            <StatusBar
              backgroundColor={`${Colors.LwscBlue}cc`}
              barStyle="light-content"
            />
            {/* <StackNavigator /> */}
            <Bootstrap />
          </NavigationContainer>
        </>
      </PaperProvider>
    </Provider>
  );
}
