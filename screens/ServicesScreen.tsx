import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
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
import SewerConnection from "../assets/sewer_connection.svg";
import FeacalSludgeMgt from "../assets/feacal_sludge_mgt.svg";
import OnsiteSanitation from "../assets/onsite_sanitation.svg";
import ChangeConnection from "../assets/change_connection.svg";
import { ServiceType } from "../types/service-type";
import { ServiceItemI, ServiceItem } from "../models/service-item";
import { connect } from "react-redux";
import { RootReducerI } from "../redux/reducers";
import { bindActionCreators } from "redux";
import { setServiceTypes } from "../redux/actions/services";
import { fetchServices } from "../models/axios";

interface ServicesI {
  navigation: NavType;
  serviceTypes: ServiceItemI[];
  setServiceTypes(serviceType: ServiceItemI[]): void;
}

const ServicesScreen = ({
  navigation,
  serviceTypes,
  setServiceTypes,
}: ServicesI) => {
  const { container, btnsBox, iconContainer } = styles;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let is_subscribed = true;

    if (is_subscribed) {
      if (!serviceTypes.length) {
        setLoading(true);
        fetchServices()
          .then((res) => {
            const { success, payload, error, message } = res.data;

            if (success) {
              setServiceTypes(payload.map((item) => new ServiceItem(item)));
            } else {
              Alert.alert(
                "Services Error",
                error || message || "Failed to retrieve services."
              );
            }
          })
          .catch((err) => {
            console.log(err);
            const { title, message } = Strings.SELF_REPORTING_PROBLEM;
            Alert.alert(title, message);
          })
          .finally(() => setLoading(false));
      }
    }

    return () => {
      is_subscribed = false;
    };
  }, [serviceTypes]);

  return (
    <ScrollView style={container}>
      <View style={btnsBox}>
        {serviceTypes.map((btn) => (
          <View
            key={btn._id}
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
                  navigation.navigate(Strings.GeneralServiceForm, {
                    title: btn.title,
                    type: ServiceType,
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
                        backgroundColor: btn.app_icon.bgColor,
                      },
                    ]}
                  >
                    {/* {btn.icon} */}
                  </View>
                  <Text
                    style={{
                      marginHorizontal: 5,
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    {btn.title}
                  </Text>
                </React.Fragment>
              </TouchableHighlight>
            </View>
          </View>
        ))}
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
                    title: btn.label,
                    type: ServiceType,
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
  // {
  //   icon: <WaterTruck width={100} height={33} fill="#1081e9" />,
  //   label: "Bowser",
  //   color: `#1081e923`,
  //   component: Strings.BowserForm,
  //   type: ServiceType.Bowser,
  // },
  // {
  //   icon: (
  //     <FontAwesome5 name="tachometer-alt" color={Colors.LwscBlack} size={26} />
  //   ),
  //   label: "Open Account",
  //   color: "#00000023",
  //   component: Strings.OpenAccountForm,
  // },
  {
    icon: (
      <MaterialCommunityIcons
        size={27}
        color="#7d7d7d"
        name="pipe-disconnected"
      />
    ),
    label: "Reconnection",
    color: "#adadad23",
    component: Strings.ReConnection,
    type: ServiceType.LeakDetection,
  },
  {
    icon: <MaterialCommunityIcons color="#1ac3ee" name="pipe-leak" size={25} />,
    label: "Leak Detection",
    color: "#1ac3ee23",
    component: Strings.GeneralServiceForm,
    type: ServiceType.LeakDetection,
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
    type: ServiceType.MeterTest,
  },
  {
    icon: <ChangeConnection width={30} height={30} fill="#a25d1a" />,
    label: "Change of Connection",
    color: "#adadad23",
    component: Strings.GeneralServiceForm,
    type: ServiceType.ChangeOfConnection,
  },
  {
    icon: <SewerHome width={40} height={28} fill="#00bb27" />,
    label: "Sewer Unblocking",
    color: "#1ac3ee23", // brown
    component: Strings.GeneralServiceForm,
    type: ServiceType.SewerUnblocking,
  },
  {
    icon: <WaterTap width={40} height={28} fill="#9f8771" />,
    label: "Water Connection",
    color: "#9f877123",
    component: Strings.GeneralServiceForm,
    type: ServiceType.WaterConnection,
  },
  {
    icon: <SewerConnection width={28} height={28} fill="#0190d4" />,
    label: "Sewer Connection",
    color: "#1ac3ee23",
    component: Strings.GeneralServiceForm,
    type: ServiceType.SewerConnection,
  },
  {
    icon: <OnsiteSanitation width={28} height={28} fill={Colors.LwscOrange} />,
    label: "Onsite Sanitation",
    color: `${Colors.LwscOrange}19`,
    component: Strings.GeneralServiceForm,
    type: ServiceType.OnsiteSanitation,
  },
  {
    icon: <FeacalSludgeMgt width={28} height={28} fill="#a25d1a" />,
    label: "Feacal Sludge Mgt",
    color: "#a25d1a23",
    component: Strings.GeneralServiceForm,
    type: ServiceType.FeacalSludgeMgt,
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

(
      <MaterialCommunityIcons
        size={27}
        color="#7d7d7d"
        name="pipe-disconnected"
      />
    )
 */

const mapPropsToState = ({ services }: RootReducerI) => ({
  serviceTypes: services,
});
const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      setServiceTypes,
    },
    dispatch
  );

export default connect(mapPropsToState, mapDispatchToProps)(ServicesScreen);

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
