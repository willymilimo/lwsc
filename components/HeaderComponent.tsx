import React from "react";
import Colors from "../constants/Colors";
import { StyleSheet, View, StatusBar, Text } from "react-native";
import {
  Appbar,
  // Menu,
  Badge,
  // Button,
  IconButton,
  BodyText,
  Switch,
  // MenuItem,
} from "material-bread";
import Menu, { MenuItem } from "react-native-material-menu";
import { RootReducerI } from "../redux/reducers";
import { connect } from "react-redux";
import { setThemeReducer } from "../redux/actions/theme";
import { ThemeReducer } from "../types/theme";
import Styles from "../constants/Styles";
import { bindActionCreators } from "redux";
import Strings from "../constants/Strings";

const menuStyle = {
  [Strings.BLUE_THEME]: {
    name: Strings.WHITE_THEME,
    bgColor: Colors.whiteColor,
    text: "White",
    textColor: Colors.LwscBlackLighter,
  },
  [Strings.WHITE_THEME]: {
    name: Strings.BLUE_THEME,
    bgColor: Colors.LwscBlue,
    text: "Blue",
    textColor: Colors.whiteColor,
  },
};

interface HeaderComponentI {
  navigation: any;
  title: string;
  show_back: boolean;
  params?: any;
  setThemeReducer(theme: ThemeReducer): void;
  themeReducer: ThemeReducer;
}

type HeaderComponentT = HeaderComponentI;

const HeaderComponent = ({
  title,
  params,
  show_back,
  navigation,
  setThemeReducer,
  themeReducer,
}: HeaderComponentT) => {
  const { name, theme } = themeReducer;
  const [activeTheme, setActiveTheme] = React.useState(name);
  const [style, setStyle] = React.useState(menuStyle[name]);
  const [menu, setMenu] = React.useState(null);

  const showMenu = () => {
    menu.show();
  };

  const hideMenu = () => {
    menu.hide();
  };

  React.useEffect(() => {
    let is_subscribed = true;

    if (is_subscribed) {
      setThemeReducer({ name: activeTheme, theme: Styles[activeTheme] });
      setStyle(menuStyle[activeTheme]);
    }

    return () => {
      is_subscribed = false;
    };
  }, [activeTheme]);
  // console.log(theme);

  return (
    <View style={styles.container}>
      <StatusBar />
      <Appbar
        style={{ borderBottomWidth: 0.75, borderBottomColor: "#00000033" }}
        color={theme.backgroundColor}
        elevation={0}
        titleStyles={{ color: theme.textColor }}
        // actionItemsStyle={{color: Colors.PrimaryColor}},
        barType={"normal"}
        title={title}
        navigation={
          show_back ? (
            <IconButton name="arrow-back" size={24} color={theme.textColor} />
          ) : null
        }
        onNavigation={() => console.log("onNavigation!")}
        actionItems={[
          <Badge
            containerStyle={{
              marginRight: 16,
              flex: 1,
              backgroundColor: "red",
            }}
            color={Colors.notificationRed}
            textColor={"white"}
            size={14}
            content={77}
          >
            <IconButton
              name="notifications"
              size={24}
              color={theme.textColor}
              
            />
          </Badge>,
          <Menu
            ref={(ref: any) => setMenu(ref)} //this.setMenuRef
            // visible={showMenu}
            menuStyle={{ width: 50, right: 0, height: 35 }}
            // onBackdropPress={() => setShowMenu(false)}
            button={
              <IconButton
                name="more-vert"
                size={24}
                color={theme.textColor}
                onPress={showMenu}
              />
            }
          >
            <MenuItem
              style={{ backgroundColor: style.bgColor }}
              onPress={() => {
                hideMenu();
                setActiveTheme(style.name);
                // console.log(style.name);
              }}
            >
              <Text style={{ color: style.textColor }}>{style.text}</Text>
            </MenuItem>
          </Menu>,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
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
