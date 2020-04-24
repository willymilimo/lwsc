import React from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { connect } from "react-redux";
import {
  FontAwesome,
  MaterialCommunityIcons,
  Octicons,
  Entypo,
  MaterialIcons,
  AntDesign,
  SimpleLineIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import Colors from "../constants/Colors";
import Layouts from "../constants/Layouts";
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import Carousel from "../components/Carousel";
import { RootReducerI } from "../redux/reducers";
import { banner_1, banner_2, banner_3 } from "../constants/Images";
import Strings from "../constants/Strings";
import { useNavigation, Route } from "@react-navigation/native";
import LwscButton from "../components/LwscButton";
import { ThemeReducer } from "../types/theme";

interface HomeI {
  theme: ThemeReducer;
  route: Route<string>;
}

const HomeScreen = ({ theme, route }: HomeI) => {
  const {
    container,
    scrollViewStyle,
    btnsBox,
    btnStyle,
    iconContainer,
  } = styles;
  const navigation = useNavigation();
  // console.log(route);

  React.useEffect(() => {
    let is_subscribed = true;

    console.log(
      is_subscribed,
      !!route.params,
      (route.params as { toNotifications: boolean }).toNotifications
    )

    if (
      is_subscribed &&
      route.params &&
      (route.params as { toNotifications: boolean }).toNotifications
    ) {
      console.log('here...')
      navigation.navigate(Strings.NotificationsScreen);
    }

    return () => {
      is_subscribed = false;
    };
  }, [route]);

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
    component: Strings.MakePaymentScreen,
  },
  {
    icon: <FontAwesome5 name="tachometer-alt" color="#1081e9" size={30} />,
    label: "Meter Reading",
    color: "#1081e923",
    component: "test",
  },
  {
    icon: <Octicons name="settings" color={Colors.LwscBlack} size={30} />,
    label: "Services",
    color: "#00000023",
    component: Strings.ServicesScreen,
  },
  {
    icon: <FontAwesome name="map-marker" color="maroon" size={40} />,
    label: "Pay Points",
    color: "#ff000023",
    component: Strings.LocatePayPointScreen,
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

export default connect(mapStateToProps)(HomeScreen);
