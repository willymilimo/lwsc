import React from "react";
import Colors from "../constants/Colors";
import { StyleSheet, View, StatusBar, Text, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Menu, { MenuItem } from "react-native-material-menu";
import { RootReducerI } from "../redux/reducers";
import { connect } from "react-redux";
import { setThemeReducer } from "../redux/actions/theme";
import { ThemeReducer } from "../types/theme";
import Styles from "../constants/Styles";
import { bindActionCreators } from "redux";
import Strings from "../constants/Strings";
import { TouchableHighlight, Switch } from "react-native-gesture-handler";
import Layouts from "../constants/Layouts";
import { IconButton, Badge } from "react-native-paper";
import LswsIconButton from "./LswsIconButton";

interface HeaderComponentI {
  navigation: any;
  title: string;
  previous: string;
  setThemeReducer(theme: ThemeReducer): void;
  themeReducer: ThemeReducer;
  headerTintColor?: string;
}

type HeaderComponentT = HeaderComponentI;

const HeaderComponent = ({
  title,
  previous,
  navigation,
  setThemeReducer,
  themeReducer,
}: HeaderComponentT) => {
  const { name, theme } = themeReducer;
  const [activeTheme, setActiveTheme] = React.useState(name);
  console.log(name)

  React.useEffect(() => {
    let is_subscribed = true;

    if (is_subscribed) {
      setThemeReducer({ name: activeTheme, theme: Styles[activeTheme] });
    }

    return () => {
      is_subscribed = false;
    };
  }, [activeTheme]);
  // console.log(theme);

  return (
    <View>
      <StatusBar backgroundColor={`${Colors.LwscBlue}aa`} />
      <View
        style={[styles.container, { backgroundColor: theme.backgroundColor }]}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {previous && (
            <LswsIconButton
              onPress={navigation.goBack}
              content={
                <Ionicons
                  icon={`${Platform.OS === "ios" ? "ios" : "md"}-arrow-back`}
                  size={24}
                  color={theme.textColor}
                />
              }
            />
          )}
          <Text
            style={{
              marginLeft: 20,
              fontWeight: "bold",
              fontSize: 19,
              color: theme.textColor,
            }}
          >
            {title}
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: 100,
              alignItems: "center",
            }}
          >
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={
                activeTheme === Strings.WHITE_THEME
                  ? Colors.LwscBlue
                  : Colors.whiteColor
              }
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                setActiveTheme(
                  activeTheme === Strings.WHITE_THEME
                    ? Strings.BLUE_THEME
                    : Strings.WHITE_THEME
                );
              }}
              value={activeTheme === Strings.WHITE_THEME}
            />
            <LswsIconButton
              onPress={() => navigation.navigate(Strings.NotificationsScreen)}
              content={
                <View
                  style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "row",
                    position: "relative",
                    // backgroundColor: 'pink',
                    alignItems: "flex-end",
                  }}
                >
                  <Ionicons
                    color={theme.textColor}
                    name={`${
                      Platform.OS === "ios" ? "ios" : "md"
                    }-notifications`}
                    size={24}
                  />
                  <Badge style={{ position: "absolute", right: -3, top: -3 }}>
                    13
                  </Badge>
                </View>
              }
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    // height: 80,
    paddingVertical: 30,
    alignItems: "center",
    // backgroundColor: "pink",
    // margin: 0,

    shadowColor: Colors.LwscBlue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  themeItemBox: {
    display: "flex",
    flexDirection: "row",
  },
  themeColorItem: {
    width: 10,
  },
  themeTextItem: {
    fontSize: 10,
  },
});

const mapStateToProps = ({ theme }: RootReducerI) => ({ themeReducer: theme });

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      setThemeReducer,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);

//https://us04web.zoom.us/j/2957286000?status=success
