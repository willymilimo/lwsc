import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  FontAwesome,
  FontAwesome5,
  Octicons,
  MaterialIcons,
  Entypo,
} from "@expo/vector-icons";
import Strings from "../constants/Strings";
import Colors from "../constants/Colors";
import LwscButton from "../components/LwscButton";
import Layouts from "../constants/Layouts";
import { NavType } from "../types/nav-type";
import WaterTruck from "../assets/water_truck.svg";
import WaterTap from "../assets/water_tap.svg";

interface ServicesI {
  navigation: NavType;
}

const ServicesScreen = ({ navigation }: ServicesI) => {
  const { container, btnsBox, iconContainer } = styles;
  return (
    <ScrollView style={container}>
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
  );
};

const btns = [
  {
    // icon: <FontAwesome name="credit-card" color="#00bb27" size={25} />,
    icon: <WaterTruck width={120} height={40} fill="#1081e9" />,
    label: "Bowser",
    color: `#1081e923`,
    component: Strings.BowserForm,
  },
  {
    icon: (
      <FontAwesome5 name="tachometer-alt" color={Colors.LwscBlack} size={30} />
    ),
    // icon: <WaterTap width={120} height={40} fill="#1081e9" />,
    label: "Open Account",
    color: "#00000023",
    component: Strings.OpenAccountForm,
  },
  //   {
  //     // icon: <Octicons name="settings" color={Colors.LwscBlack} size={30} />,
  //     icon: <WaterTruck width={120} height={40} fill="#00bb27" />,
  //     label: "Services",
  //     color: "#00000023",
  //     component: Strings.ServicesScreen,
  //   },
  //   {
  //     // icon: <FontAwesome name="map-marker" color="maroon" size={40} />,
  //     icon: <WaterTruck width={120} height={40} fill="#00bb27" />,
  //     label: "Pay Points",
  //     color: "#ff000023",
  //     component: Strings.LocatePayPointScreen,
  //   },
  //   {
  //     // icon: <Entypo name="drop" color="#1ac3ee" size={30} />,
  //     icon: <WaterTruck width={120} height={40} fill="#00bb27" />,
  //     label: "Report Leakage",
  //     color: "#1ac3ee23",
  //     component: "test2",
  //   },
  //   {
  //     // icon: (
  //     //   <MaterialIcons
  //     //     name="report-problem"
  //     //     color={Colors.LwscOrange}
  //     //     size={30}
  //     //   />
  //     // ),
  //     icon: <WaterTruck width={120} height={40} fill="#00bb27" />,
  //     label: "Lodge Complaint",
  //     color: "#fdd02333",
  //     component: "test3",
  //   },
];

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
    marginHorizontal: 50,
    justifyContent: "space-between",
    paddingTop: 20,
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
