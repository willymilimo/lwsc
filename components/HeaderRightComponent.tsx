import React from "react";
import Colors from "../constants/Colors";
import { View, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RootReducerI } from "../redux/reducers";
import { connect } from "react-redux";
import { setThemeReducer } from "../redux/actions/theme";
import { ThemeReducer } from "../types/theme";
import Styles from "../constants/Styles";
import { bindActionCreators } from "redux";
import Strings from "../constants/Strings";
import { Switch } from "react-native-gesture-handler";
import { Badge } from "react-native-paper";
import LswsIconButton from "./LswsIconButton";
import { useNavigation } from "@react-navigation/native";

interface HeaderRightComponentI {
  setThemeReducer(theme: ThemeReducer): void;
  themeReducer: ThemeReducer;
  notifications: number;
}

type HeaderRightComponentT = HeaderRightComponentI;

const HeaderRightComponent = (props: HeaderRightComponentT) => {
  const { setThemeReducer, themeReducer, notifications } = props;
  // console.log(props);
  const { name, theme } = themeReducer;
  const [activeTheme, setActiveTheme] = React.useState(name);
  const [notices, setNotices] = React.useState(notifications);
  const navigation = useNavigation();

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

  React.useEffect(() => {
    let is_subscribed = true;

    if (is_subscribed) {
      setNotices(notifications);
    }

    return () => {
      is_subscribed = false;
    };
  }, [notifications]);

  return (
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
              alignItems: notices === 0 ? "center" : "flex-end",
            }}
          >
            <Ionicons
              color={theme.textColor}
              name={`${Platform.OS === "ios" ? "ios" : "md"}-notifications`}
              size={24}
            />

            <Badge
              visible={notices !== 0}
              style={{ position: "absolute", right: -3, top: -3 }}
            >
              {notices}
            </Badge>
          </View>
        }
      />
    </View>
  );
};

const mapStateToProps = ({ theme }: RootReducerI) => ({
  themeReducer: theme,
  // notifications,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      setThemeReducer,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderRightComponent);

//https://us04web.zoom.us/j/2957286000?status=success
