import React from "react";
import { View, Platform } from "react-native";
import { IconButton } from "react-native-paper";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import Strings from "../constants/Strings";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setUserReducer } from "../redux/actions/user";
import { UserReducerI } from "../redux/reducers/user";

interface PropI {
  setUserReducer(user: UserReducerI): void;
  tintColor: string;
}

type PropT = PropI;

const HeaderRightComponent = ({ tintColor, setUserReducer }: PropT) => {
  const navigator = useNavigation();
  return (
    <View style={{ display: "flex", flexDirection: "row" }}>
      <IconButton
        icon={() => (
          <Ionicons
            onPress={() => navigator.navigate(Strings.HomeTabNavigator)}
            style={{ marginRight: 10 }}
            size={25}
            color={tintColor}
            name={`${Platform.OS === "ios" ? "ios" : "md"}-home`}
          />
        )}
        color={tintColor}
      />
      <IconButton
        color={tintColor}
        icon={() => (
          <AntDesign
            onPress={() => {
              setUserReducer({
                username: "",
                authToken: "",
                manNumber: "",
                createdAt: 0,
              });
              navigator.navigate(Strings.HomeTabNavigator);
            }}
            style={{ marginRight: 10 }}
            name="logout"
            size={20}
            color={tintColor}
          />
        )}
      />
    </View>
  );
};

const mapStateToProps = () => ({});

const matchDispatch = (dispatch: any) =>
  bindActionCreators({ setUserReducer }, dispatch);

export default connect(mapStateToProps, matchDispatch)(HeaderRightComponent);
