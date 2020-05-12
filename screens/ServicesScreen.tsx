import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import {
  FontAwesome,
  FontAwesome5,
  Octicons,
  MaterialIcons,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Strings from "../constants/Strings";
import Colors from "../constants/Colors";
import LwscButton from "../components/LwscButton";
import Layouts from "../constants/Layouts";
import { NavType } from "../types/nav-type";
import WaterTruck from "../assets/water_truck.svg";
import WaterTap from "../assets/water_tap.svg";
import SewerHome from "../assets/sewer_home.svg";

interface ServicesI {
  navigation: NavType;
}

const ServicesScreen = ({ navigation }: ServicesI) => {
  const { container, btnsBox, iconContainer } = styles;
  return (
    <ScrollView style={container}>
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
                onPress={() => navigation.navigate(btn.component)}
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
                  <Text
                    style={{
                      marginHorizontal: 5,
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    {btn.label}
                  </Text>
                </React.Fragment>
              </TouchableHighlight>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const btns = [
  {
    icon: <WaterTruck width={100} height={33} fill="#1081e9" />,
    label: "Bowser",
    color: `#1081e923`,
    component: Strings.BowserForm,
  },
  // {
  //   icon: (
  //     <FontAwesome5 name="tachometer-alt" color={Colors.LwscBlack} size={26} />
  //   ),
  //   label: "Open Account",
  //   color: "#00000023",
  //   component: Strings.OpenAccountForm,
  // },
  {
    icon: <Entypo name="drop" color="#1ac3ee" size={25} />,
    label: "Leak Detection",
    color: "#1ac3ee23",
    component: Strings.ServicesScreen,
  },
  {
    icon: (
      <FontAwesome5
        name="tachometer-alt"
        color={`${Colors.LwscBlack}bb`}
        size={26}
      />
    ),
    label: "Meter Test",
    color: "#00000023",
    component: Strings.LocatePayPointScreen,
  },
  {
    icon: (
      <MaterialCommunityIcons
        size={27}
        color="#1081e9"
        name="pipe-disconnected"
      />
    ),
    label: "Change of Connection",
    color: "#1ac3ee23",
    component: "test2",
  },
  {
    icon: <SewerHome width={120} height={40} fill="#00bb27" />,
    label: "Sewer Unblocking",
    color: "#1ac3ee23",
    component: "test2",
  },
  {
    icon: <WaterTruck width={120} height={40} fill="#00bb27" />,
    label: "Water Connection",
    color: "#1ac3ee23",
    component: "test2",
  },
  {
    icon: <WaterTruck width={120} height={40} fill="#00bb27" />,
    label: "Sewer Connection",
    color: "#1ac3ee23",
    component: "test2",
  },
  {
    icon: <WaterTruck width={120} height={40} fill="#00bb27" />,
    label: "Onsite Sanitation",
    color: "#1ac3ee23",
    component: "test2",
  },
  {
    icon: <WaterTruck width={120} height={40} fill="#00bb27" />,
    label: "Feacal Sludge Mgt",
    color: "#1ac3ee23",
    component: "test2",
  },
];
/**
1.      Leak Detection investigation
2.      Meter Test
3.      Pipe Locating
4.      Change of Connection
5.      Private Sewer unblocking
6.      Meter Separation
7.      New water connection
8.      New Sewer Connection
9.      Onsite Sanitation Services
10.     Feacal Sludge Management
 */
export default ServicesScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
  },
  btnsBox: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingVertical: 20,
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
