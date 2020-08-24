import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, Image } from "react-native";
import { connect } from "react-redux";
import {
  FontAwesome,
  MaterialCommunityIcons,
  Octicons,
  Entypo,
  MaterialIcons,
  AntDesign,
  FontAwesome5,
} from "@expo/vector-icons";
import Colors from "../constants/Colors";
import Layouts from "../constants/Layouts";
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import Carousel from "../components/Carousel";
import { RootReducerI } from "../redux/reducers";
import { banner_1, banner_2, banner_3, zmw_100 } from "../constants/Images";
import Consumption from "../assets/consumption.svg";
import Strings from "../constants/Strings";
import { useNavigation, Route } from "@react-navigation/native";
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
            <View
              key={btn.label}
              style={{
                width: Layouts.window.width / 3,
                height: Layouts.window.width / 3,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: "82%",
                  height: "82%",
                  borderRadius: 10,
                  backgroundColor: "#fff",
                  shadowColor: `${Colors.linkBlue}22`,

                  elevation: 5,

                  shadowOffset: {
                    width: 1,
                    height: 1,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 1,
                }}
              >
                <TouchableHighlight
                  underlayColor="#55555533"
                  onPress={() =>
                    navigation.navigate(btn.component, {
                      isConsumption: btn.label === "Consumption",
                    })
                  }
                  style={{
                    padding: 5,
                    height: "100%",
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <React.Fragment>
                    <View
                      style={[
                        iconContainer,
                        {
                          height: "55%",
                          width: "55%",
                          backgroundColor: btn.color,
                        },
                      ]}
                    >
                      {btn.icon}
                    </View>
                    <View
                      style={{
                        // flex: btn.label.length < 11 ? 0.66 : 1,
                        alignContent: "center",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          marginHorizontal: 5,
                          fontWeight: "600",
                          textAlign: "center",
                          fontSize: Layouts.isSmallDevice ? 11 : 13,
                        }}
                      >
                        {btn.label}
                      </Text>
                    </View>
                  </React.Fragment>
                </TouchableHighlight>
              </View>
            </View>
          ))}
          <View
            style={{
              width: Layouts.window.width / 3,
              height: Layouts.window.width / 3,
            }}
          />
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
    icon: (
      <Image style={{ width: 35, height: (94 * 35) / 192 }} source={zmw_100} />
    ) /* <FontAwesome name="credit-card" color="#00bb27" size={20} />*/,
    label: "Make Payment",
    color: `#efefef`,
    component: Strings.MakePaymentScreen,
  },
  // {
  //   icon: <FontAwesome5 name="tachometer-alt" color="#1081e9" size={25} />,
  //   label: "Meter Reading",
  //   color: "#1081e923",
  //   component: Strings.MeterReadingNavigator,
  // },
  {
    icon: <Octicons name="settings" color={Colors.LwscBlack} size={25} />,
    label: "Service Request",
    color: "#00000023",
    component: Strings.ServicesScreen,
  },
  {
    icon: <FontAwesome name="map-marker" color="maroon" size={30} />,
    label: "Pay Points",
    color: "#ff000023",
    component: Strings.LocatePayPointScreen,
  },
  {
    icon: <Entypo name="drop" color="#1ac3ee" size={25} />,
    label: "Report Leakage",
    color: "#1ac3ee23",
    component: Strings.ReportLeakageScreen,
  },
  {
    icon: (
      <MaterialIcons
        name="report-problem"
        color={Colors.LwscOrange}
        size={25}
      />
    ),
    label: "Lodge Complaint",
    color: "#fdd02333",
    component: Strings.LodgeComplaintScreen,
  },
  {
    icon: <MaterialCommunityIcons name="history" color="#1081e9" size={25} />,
    label: "Payment History",
    color: "#1081e923",
    component: Strings.PaymentHistoryListScreen,
  },
  {
    icon: <Consumption width={20} height={20} fill="#1081e9" />,
    label: "Consumption",
    color: "#00000011",
    component: Strings.PaymentHistoryListScreen,
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
    // marginHorizontal: 50,
    justifyContent: "space-between",
    paddingTop: 20,
  },
  btnStyle: {
    // height: 120,
    // width: 120,
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
