import React, { Component } from "react";
import { StyleSheet, Text, View, Platform, Linking, Alert } from "react-native";
import { TextInput, Button, IconButton } from "react-native-paper";
import { InputItemType } from "../types/input-item";
import { ResponseI } from "../types/response";
import Colors from "../constants/Colors";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { RequestI } from "../types/request";
import Strings from "../constants/Strings";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { Easing } from "react-native-reanimated";
import LwscFAB from "../components/LwscFAB";

const FeedbackScreen = () => {
  let _open = true;
  const { container, buttonStyle } = styles;
  const [animation, setAnimation] = React.useState(new Animated.Value(1));
  // const [request, setRequest] = React.useState<RequestI>({
  //   loading: false,
  //   response: null,
  // });
  const [loading, setLoading] = React.useState(false);
  const [fullName, setFullName] = React.useState<InputItemType<string>>({
    value: "",
    error: false,
  });
  const [message, setMessage] = React.useState<InputItemType<string>>({
    value: "",
    error: false,
  });

  const openPlayAppStore = (play: string, store: string) => {
    const play_appstore =
      Platform.OS == "ios"
        ? `https://itunes.apple.com/${store}`
        : `market://details?id=${play}`;

    Linking.canOpenURL(play_appstore)
      .then((isSupported) => {
        if (isSupported) Linking.openURL(play_appstore);
      })
      .catch((err) => {
        const store = Platform.OS == "ios" ? "App Store" : "Google Play Store";
        Alert.alert(
          `${store} Missing`,
          `Unable to open ${name}. Please ensure you have a ${store} installed.`
        );
      });
  };

  const handleButtonPress = (icon_name: string, url: UrlI): void => {
    const { store, play, app, web } = url;

    if (app.length) {
      Linking.canOpenURL(app)
        .then((isSupported) => {
          // console.log(`app: ${app}, ${isSupported}`);
          if (isSupported) Linking.openURL(app);
          else openPlayAppStore(play, store);
        })
        .catch((err) => {
          // console.log(err);
          let name = icon_name.replace("-", " ");
          name = capitalize(name);

          Alert.alert(
            `${name} Missing`,
            `Unable to open ${name}. Please ensure you have a ${name} installed.`
          );
        });
    } else if (store.length && play.length) {
      openPlayAppStore(play, store);
    } else {
      // NavigationService.push(Strings.ContactUsStack + Strings.WebViewScreen, {
      //   uri: web,
      // });
    }
  };

  const capitalize = (str: string) => {
    var splitStr = str.toLowerCase().split(" ");
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
  };

  const toggleOpen = () => {
    const toValue = _open ? 0 : 1;

    Animated.timing(animation, {
      toValue,
      easing: Easing.ease,
      duration: 200,
    }).start();

    _open = !_open;
  };

  const handleSubmit = () => {
    console.log(fullName, message);
    setLoading(true);
  };

  return (
    <View style={container}>
      <TextInput
        disabled={loading}
        autoFocus={true}
        mode="outlined"
        label={"Full Name"}
        value={fullName.value}
        error={fullName.error}
        onChangeText={(value) => setFullName({ value, error: false })}
      />
      <TextInput
        disabled={loading}
        style={{ marginTop: 15 }}
        multiline={true}
        numberOfLines={10}
        mode="outlined"
        label={"Your feedback"}
        value={message.value}
        error={message.error}
        onChangeText={(value) => setMessage({ value, error: false })}
      />
      <Button
        style={{ marginTop: 15 }}
        contentStyle={{
          borderColor: Colors.linkBlue,
          borderWidth: 0.75,
          borderRadius: 5,
          backgroundColor: `${Colors.linkBlue}22`,
        }}
        color={`${Colors.LwscBlue}bb`}
        loading={loading}
        icon="send"
        mode="outlined"
        onPress={handleSubmit}
      >
        Submit
      </Button>

      {buttons.map(({ icon, color, bg, url }, index) => {
        const style = {
          transform: [
            {
              scale: animation,
            },
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -(index + 1) * 70 - 10],
              }),
            },
          ],
        };

        return (
          // <Animated.View
          //   style={[
          //     buttonStyle,
          //     style,
          //     {
          //       width: 50,
          //       height: 50,
          //       right: 25,
          //       backgroundColor: bg,
          //       borderColor: bg === Colors.whiteColor ? color : bg,
          //     },
          //   ]}
          // >
          //   <IconButton
          //     icon={({ size, color }) => (
          //       <icon.type name={icon.name} color={color} size={23} />
          //     )}
          //     color={color}
          //     onPress={() => handleButtonPress(icon.name, url)}
          //   />
          // </Animated.View>
          <LwscFAB
            style={style}
            backgroundColor={bg}
            color={color}
            icon={icon}
            onPress={() => handleButtonPress(icon.name, url)}
          />
        );
      })}

      <IconButton
        style={[
          {
            borderWidth: 0.5,
            borderColor: Colors.linkBlue,
            backgroundColor: `${Colors.linkBlue}22`,
          },
          buttonStyle,
        ]}
        icon="layers"
        color={`${Colors.LwscBlue}bb`}
        size={40}
        onPress={toggleOpen}
      />
    </View>
  );
};

export default FeedbackScreen;

interface ButtonI {
  icon: { type: any; name: string };
  color: string;
  bg: string;
  url: UrlI;
}

interface UrlI {
  store: string;
  play: string;
  app: string;
  web: string;
}

const buttons: Array<ButtonI> = [
  {
    icon: { name: "facebook", type: MaterialCommunityIcons },
    color: Colors.whiteColor,
    bg: Colors.facebook,
    url: {
      store: "app/facebook/id284882215",
      play: "com.facebook.katana",
      app: `fb://page/${Strings.FACEBOOK}`, //495954420452034
      web: `https://www.facebook.com/${Strings.FACEBOOK}`,
    },
  },
  {
    icon: {
      name: "facebook-messenger",
      type: MaterialCommunityIcons,
    },
    color: Colors.messenger,
    bg: Colors.whiteColor,
    url: {
      store: "app/messenger/id454638411",
      play: "com.facebook.orca",
      app: `fb-messenger://user-thread/${Strings.FACEBOOK}`,
      web: Strings.MESSENGER,
    },
  },
  {
    icon: {
      name: Platform.OS === "ios" ? "ios-text" : "md-text",
      type: Ionicons,
    },
    color: `${Colors.LwscBlack}99`,
    bg: Colors.whiteColor,
    url: {
      store: "",
      play: "",
      app: `sms:${Strings.SMS}?body=Hello, `, //495954420452034
      web: ``,
    },
  },
  {
    icon: { name: "web", type: MaterialCommunityIcons },
    color: Colors.linkBlue,
    bg: Colors.whiteColor,
    url: {
      store: "",
      play: "",
      app: "",
      web: `${Strings.WEBSITE}/contact.html`, // chadizda
    },
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  buttonStyle: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    position: "absolute",
    bottom: 15,
    right: 15,
    borderWidth: 0.5,
    borderColor: Colors.linkBlue,
    backgroundColor: `${Colors.linkBlue}22`,
    zIndex: 999,
  },
});
