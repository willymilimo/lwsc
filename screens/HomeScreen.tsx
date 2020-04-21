import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  Image,
  Animated,
  Alert,
} from "react-native";
import { connect } from "react-redux";
import {
  FontAwesome,
  MaterialCommunityIcons,
  Octicons,
  Entypo,
  MaterialIcons,
  AntDesign,
} from "@expo/vector-icons";
import Colors from "../constants/Colors";
import Layouts from "../constants/Layouts";
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import Carousel from "../components/Carousel";
import { RootReducerI } from "../redux/reducers";
import { bindActionCreators } from "redux";
import { setTheme } from "../redux/actions/theme";
import { banner_1, banner_2, banner_3 } from "../constants/Images";
import Strings from "../constants/Strings";
import { useNavigation } from "@react-navigation/native";
import LwscButton from "../components/LwscButton";
import { ThemeReducer } from "../types/theme";

interface HomeI {
  theme: ThemeReducer;
}

const HomeScreen = ({ theme }: HomeI) => {
  const {
    container,
    scrollViewStyle,
    btnsBox,
    btnStyle,
    iconContainer,
  } = styles;
  const navigation = useNavigation();

  const [marginLeft, setMarginLeft] = React.useState(new Animated.Value(0));

  const animateMarginLeft = (size: number, iteration = 1) => {
    const modulo = iteration % size;
    const end = isNaN(modulo) ? 0 : -(modulo * Layouts.window.width);

    Animated.sequence([
      Animated.delay(iteration === 1 ? 0 : 7000),
      Animated.timing(marginLeft, {
        toValue: end,
        duration: 500,
        // useNativeDriver: true,
      }),
    ]).start(() => {
      animateMarginLeft(size, iteration + 1);
    });
  };

  return (
    <SafeAreaView style={container}>
      <ScrollView style={scrollViewStyle}>
        <Carousel
          style="stats"
          itemsPerInterval={1}
          items={[
            {
              label: "Sanitation is Health!",
              value: 2,
              image: banner_2,
            },
            {
              label: "Rehabilitation of Kaunda Square ponds.",
              value: 3,
              image: banner_3,
            },
            {
              label: "Water is Life... Value it!",
              value: 1,
              image: banner_1,
            },
          ]}
        />
        <View style={btnsBox}>
          {btns.map((btn) => (
            <LwscButton
              height={Layouts.window.width / 2 - 80}
              width={Layouts.window.width / 2 - 80}
              key={btn.component}
              onPress={() => navigation.navigate(btn.component)}
              content={
                <React.Fragment>
                  <View style={[iconContainer, { backgroundColor: btn.color }]}>
                    {btn.icon}
                  </View>
                  <Text style={{ fontWeight: "600", textAlign: "center" }}>
                    {btn.label}
                  </Text>
                </React.Fragment>
              }
            />
          ))}
        </View>
      </ScrollView>
      <View
        style={{
          position: "absolute",
          bottom: 10,
          right: 10,
        }}
      >
        <TouchableHighlight
          onPress={() => navigation.navigate(Strings.FeedbackScreen)}
          underlayColor={`${Colors.LwscBlue}aa`}
          style={[
            {
              backgroundColor: theme.theme.backgroundColor,
              width: 60,
              height: 60,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#333",
              elevation: 6,
              shadowOpacity: 0.8,
              shadowOffset: { width: 3, height: 3 },
              shadowRadius: 5,
              borderRadius: 30,
            },
            theme.name === Strings.WHITE_THEME
              ? { borderWidth: 0.75, borderColor: `${Colors.LwscBlue}44` }
              : {},
          ]}
        >
          <AntDesign size={30} name="message1" color={theme.theme.textColor} />
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
};

const btns = [
  {
    icon: <FontAwesome name="credit-card" color="#00bb27" size={25} />,
    label: "Make Payment",
    color: `#00bb2723`,
    component: Strings.ManageAccountsScreen,
  },
  {
    icon: <FontAwesome name="map-marker" color="maroon" size={40} />,
    label: "Pay Points",
    color: "#ff000023",
    component: Strings.LocatePayPointScreen,
  },
  {
    icon: <Octicons name="settings" color={Colors.LwscBlack} size={30} />,
    label: "Services",
    color: "#00000023",
    component: Strings.ServicesScreen,
  },
  {
    icon: (
      <MaterialCommunityIcons
        name="pipe-disconnected"
        color="#1081e9"
        size={30}
      />
    ),
    label: "Request Connection",
    color: "#1081e923",
    component: "test",
  },
  {
    icon: <Entypo name="drop" color="#1ac3ee" size={30} />,
    label: "Report Leakage",
    color: "#1ac3ee23",
    component: "test2",
  },
  {
    icon: (
      <MaterialIcons
        name="report-problem"
        color={Colors.LwscOrange}
        size={30}
      />
    ),
    label: "Lodge Complaint",
    color: "#fdd02333",
    component: "test3",
  },
];

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
  },
  scrollViewStyle: {
    display: "flex",
    flex: 1,
    // backgroundColor: 'red'
  },
  btnsBox: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 50,
    justifyContent: "space-between",
    paddingTop: 20,
  },
  btnStyle: {
    height: 120,
    width: 120,
    marginBottom: 25,
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 65,
    height: 65,
    padding: 5,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
