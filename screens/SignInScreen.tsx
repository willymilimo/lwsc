import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Modal,
  ImageBackground,
  Alert,
  Text,
} from "react-native";
import { connect } from "react-redux";
import { RootReducerI } from "../redux/reducers";
import { UserReducerI } from "../redux/reducers/user";
import { ScrollView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import Layouts from "../constants/Layouts";
import { logo } from "../constants/Images";
import {
  Subheading,
  Title,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import Colors from "../constants/Colors";
import { login } from "../models/axios";
import Strings from "../constants/Strings";
import { useNavigation } from "@react-navigation/native";
import { bindActionCreators } from "redux";
import { setUserReducer } from "../redux/actions/user";

interface PropI {
  user: UserReducerI;
  setUserReducer(user: UserReducerI): void;
}
const SignInScreen = ({ user, setUserReducer }: PropI) => {
  const navigator = useNavigation();
  const {
    container,
    gradientStyle,
    imgContainer,
    contentBox,
    topper,
    form,
    flexRow,
  } = styles;
  const [username, setUsername] = useState({ value: "", error: false });
  const [manNumber, setManNumber] = useState({ value: "", error: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let is_subscribed = true;
    if (is_subscribed && user.authToken && user.createdAt && user.manNumber) {
      navigator.navigate(Strings.BillGroupScreen);
    }
    return () => {
      is_subscribed = false;
    };
  }, [user]);

  const handleLogin = () => {
    setLoading(true);
    login(username.value, manNumber.value)
      .then(({ status, data }) => {
        if (status !== 200) {
          throw new Error(JSON.stringify(data));
        }

        if (data.success) {
          setUserReducer({
            username: username.value,
            manNumber: manNumber.value,
            authToken: data.payload,
            createdAt: new Date().valueOf(),
          });
          // navigator.navigate(Strings.BillGroupScreen);
        } else {
          const { title, message } = Strings.INVALID_CREDENTIALS;
          Alert.alert(title, message);
        }
      })
      .catch((err) => {
        const { title, message } = Strings.SELF_REPORTING_PROBLEM;
        Alert.alert(title, message, [
          { onPress: () => navigator.navigate(Strings.HomeTabNavigator) },
        ]);
      })
      .finally(() => setLoading(false));
  };

  return (
    <ScrollView style={container}>
      <Modal animationType="slide" transparent visible={loading}>
        <View style={[styles.centeredView, { backgroundColor: "#00000077" }]}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large" color={Colors.LwscOrange} />
          </View>
        </View>
      </Modal>
      <LinearGradient
        start={[0, 0]}
        end={[1, 0]}
        colors={["#56cbf1", "#5a86e4"]}
        style={gradientStyle}
      >
        <View style={contentBox}>
          <ImageBackground
            style={imgContainer}
            source={logo}
            imageStyle={{ width: 120, height: 120 }}
          />
          <View style={topper}></View>
          <View style={form}>
            <Title
              style={{
                alignSelf: "center",
                textTransform: "uppercase",
                marginTop: 10,
              }}
            >
              Staff Login
            </Title>
            <TextInput
              disabled={loading}
              value={username.value}
              error={username.error}
              onChangeText={(text) =>
                setUsername({
                  value: text,
                  error: !/^[a-z]+$/i.test(text),
                })
              }
              selectionColor="#000"
              underlineColor="#000"
              style={{
                marginTop: 10,
                marginBottom: 10,
                backgroundColor: "#fff",
              }}
              label="Username"
              placeholder="e.g. zuluf"
            />
            <TextInput
              disabled={loading}
              value={manNumber.value}
              error={manNumber.error}
              onChangeText={(text) =>
                setManNumber({
                  value: text,
                  error: !/^[0-9]{3,}$/i.test(text),
                })
              }
              selectionColor="#000"
              underlineColor="#000"
              style={{ backgroundColor: "#fff" }}
              label="Man Number"
              placeholder="e.g. 40007"
            />
            <Button
              mode="contained"
              style={{ marginVertical: 20 }}
              color={Colors.linkBlue}
              disabled={loading || username.error || manNumber.error}
              onPress={handleLogin}
            >
              Login
            </Button>
            <View style={flexRow}>
              <Subheading>Not a member of staff?</Subheading>
              <Button
                disabled={loading}
                color={Colors.linkBlue}
                labelStyle={{ textTransform: "capitalize" }}
                onPress={() => {
                  navigator.navigate(Strings.SelectAreaScreen, {
                    toRoute: Strings.PropertiesScreen,
                  });
                }}
              >
                Tap Here
              </Button>
            </View>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

const mapStateToProps = ({ user }: RootReducerI) => ({
  user,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ setUserReducer }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
  },
  gradientStyle: {
    height: Layouts.window.height,
  },
  contentBox: {
    marginTop: 50,
    // backgroundColor: 'red',
    paddingHorizontal: 20,
    // alignSelf:'center',
  },
  imgContainer: {
    height: 123,
    width: 123,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: 75,
    alignSelf: "center",
    borderWidth: 1.5,
    borderColor: "#99c6f1",
  },
  topper: {
    backgroundColor: "#99c6f1",
    height: 7,
    marginTop: 50,
    marginHorizontal: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  form: {
    // alignItems: 'center',
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: 5,
    padding: 15,
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
