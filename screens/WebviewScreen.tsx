import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { WebView } from 'react-native-webview';
import { NavType } from "../types/nav-type";

interface WebviewI {
  navigation: NavType;
  route: {
    params: {
      transaction_id: string;
      base_redirect_url: string;
      full_redirect_url: string;
    };
  };
}

const WebviewScreen = ({ navigation, route }: WebviewI) => {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  return (
    <View style={[styles.container]}>
      <WebView
        //Enable Javascript support
        javaScriptEnabled={true}
        //For the Cache
        domStorageEnabled={true}
        //View to show while loading the webpage
        onLoad={() => setLoadingComplete(true)}
        style={[styles.container]}
        source={{ uri: route.params.full_redirect_url }}
      />
    </View>
  );
};

export default WebviewScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
  },
  activityIndicatorStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 100,
    left: 100,
  },
});
