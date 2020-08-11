import { connect } from "react-redux";
import React, { useEffect } from "react";
import { View, Text, Alert } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Colors from "../constants/Colors";
import { bindActionCreators } from "redux";
import { setUserReducer } from "../redux/actions/user";
import { UserReducerI } from "../redux/reducers/user";

interface PropI {
  setUserReducer(user: UserReducerI): void;
  navigation: any;
}

const LogoutScreen = ({ navigation, setUserReducer }: PropI) => {
  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e: any) => {
      // Prevent default behavior
      console.log(e);
      e.preventDefault();

      setUserReducer({
        username: "",
        manNumber: "",
        authToken: "",
        createdAt: 0,
      });
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator
        color={Colors.LwscOrange}
        size="large"
        style={{ alignSelf: "center" }}
      />
    </View>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ setUserReducer }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LogoutScreen);
