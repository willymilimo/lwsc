import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import store from "./redux/store";
import StackNavigator from "./navigation/StackNavigator";
import { StatusBar, Vibration, Platform } from "react-native";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import Colors from "./constants/Colors";

export default function App() {
  const [pushToken, setPushToken] = React.useState("");
  const [notifications, setNotifications] = React.useState([]);

  const registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      const token = await Notifications.getExpoPushTokenAsync();
      console.log(token);
      setPushToken(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.createChannelAndroidAsync("default", {
        name: "default",
        sound: true,
        priority: "max",
        vibrate: [0, 250, 250, 250],
      });
    }
  };

  const handleNotification = React.useCallback((notification) => {
    Vibration.vibrate(3);
    console.log(notification);
    setNotifications(notification);
  }, []);

  React.useEffect(() => {
    let is_subscribed = true;

    if (is_subscribed) {
      registerForPushNotificationsAsync();
    }

    return () => {
      is_subscribed = false;
    };
  }, []);

  React.useEffect(() => {
    let notificationSubscription = Notifications.addListener(
      handleNotification
    );

    return () => {
      notificationSubscription.remove();
    };
  }, [handleNotification]);

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
