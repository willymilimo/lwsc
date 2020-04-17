import React from "react";
import Colors from "../constants/Colors";
import { StyleSheet, View, StatusBar } from "react-native";
import { Appbar, Menu, Badge, Button, IconButton } from "material-bread";
import { RootReducerI } from "../redux/reducers";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setTheme } from "../redux/actions/theme";
import { ThemeType } from "../types/theme";

interface HeaderComponentI {
  navigation: any;
  title: string;
  show_back: string;
  params?: any;
  setTheme(theme: ThemeType): void;
}

type HeaderComponentT = HeaderComponentI;

const HeaderComponent = (props: HeaderComponentT) => {
  const { title, params, show_back, navigation } = props;
  // console.log(navigation);
  return (
    <View style={styles.container}>
      <StatusBar />
      <Appbar
        style={{ borderBottomWidth: 0.75, borderBottomColor: "#00000033" }}
        color="transparent"
        elevation={0}
        titleStyles={{ color: Colors.LwscBlackLighter }}
        // actionItemsStyle={{color: Colors.PrimaryColor}},
        barType={"normal"}
        title={title}
        // navigation={
        //   <IconButton name="menu" size={24} color={Colors.LwscBlackLighter} />
        // }
        // onNavigation={() => console.log("onNavigation!")}
        actionItems={[
          // { name: "notifications" },
          <Menu
            style={{ display: "none" }}
            visible={false}
            button={
              <Button
                textColor={"transparent"}
                text={"Show menu"}
                type="text"
              />
            }
          ></Menu>,
          <Badge
            containerStyle={{
              marginRight: 16,
              flex: 1,
              backgroundColor: "red",
            }}
            color={"#e10050"}
            textColor={"white"}
            size={14}
            content={77}
          >
            <IconButton
              name="notifications"
              size={24}
              color={Colors.LwscBlackLighter}
            />
          </Badge>,
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
});

const mapStateToProps = ({ theme }: RootReducerI) => ({ theme });

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      setTheme,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);
