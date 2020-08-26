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
import { ActivityIndicator } from "react-native-paper";
import Strings from "../constants/Strings";
import Colors from "../constants/Colors";
import Layouts from "../constants/Layouts";
import { NavType } from "../types/nav-type";
import WaterTap from "../assets/water_tap.svg";
import SewerHome from "../assets/sewer_home.svg";
import SewerConnection from "../assets/sewer_connection.svg";
import FeacalSludgeMgt from "../assets/feacal_sludge_mgt.svg";
import OnsiteSanitation from "../assets/onsite_sanitation.svg";
import ChangeConnection from "../assets/change_connection.svg";
import { ServiceItemI, ServiceItem, AppIcon } from "../models/service-item";
import { connect } from "react-redux";
import { RootReducerI } from "../redux/reducers";
import { bindActionCreators } from "redux";
import { setServiceTypes } from "../redux/actions/services";
import { fetchServices } from "../models/axios";
import { LinearGradient } from "expo-linear-gradient";

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

    if (!serviceTypes.length) {
      setLoading(true);
      fetchServices()
        .then(({ status, data }) => {
          if (is_subscribed) {
            const { success, payload, error, message } = data;
            // console.log(status, data)

            if (status === 200 && success) {
              setServiceTypes(
                payload
                  .filter((item) => item.is_active)
                  .map((item) => new ServiceItem(item))
              );
            } else {
              Alert.alert(
                "Services Error",
                error || message || "Failed to retrieve services."
              );
            }
          }
        })
        .catch((err) => {
          // console.log(err);
          if (is_subscribed) {
            const { title, message } = Strings.SELF_REPORTING_PROBLEM;
            Alert.alert(title, message);
          }
        })
        .finally(() => {
          if (is_subscribed) setLoading(false);
        });
    }

    return () => {
      is_subscribed = false;
    };
  }, [serviceTypes]);

  const createIcon = (
    icon: string,
    { type, name, color, width, height, size }: AppIcon
  ) => {
    if (type !== "svg") {
      let Icon = null;

      switch (type) {
        case "MaterialCommunityIcons":
          Icon = MaterialCommunityIcons;
          break;
        case "FontAwesome":
          Icon = FontAwesome;
          break;
        case "FontAwesome5":
          Icon = FontAwesome5;
          break;
        case "Octicons":
          Icon = Octicons;
          break;
        case "MaterialIcons":
          Icon = MaterialIcons;
          break;
        case "Entypo":
          Icon = Entypo;
          break;
        default:
          Icon = MaterialIcons;
          break;
      }
      return <Icon name={name} color={color} size={size} />;
    }

    let Icon = SewerConnection;
    switch (icon) {
      case "sewer_connection.svg":
        Icon = SewerConnection;
        break;
      case "feacal_sludge_mgt.svg":
        Icon = FeacalSludgeMgt;
        break;
      case "onsite_sanitation.svg":
        Icon = OnsiteSanitation;
        break;
      case "change_connection.svg":
        Icon = ChangeConnection;
        break;
      case "water_tap.svg":
        Icon = WaterTap;
        break;
      case "sewer_home.svg":
        Icon = SewerHome;
        break;
    }

    return <Icon width={width} height={height} fill={color} />;
  };

  return (
    <LinearGradient
      start={[0, 0]}
      end={[1, 0]}
      colors={["#56cbf1", "#5a86e4"]}
      style={{ display: "flex", flex: 1 }}
    >
      <ScrollView style={container}>
        <View style={btnsBox}>
          {loading ? (
            <View style={{ display: "flex", flex: 1, alignItems: "center" }}>
              <ActivityIndicator
                size={50}
                animating={true}
                color={Colors.colorGreen}
              />
            </View>
          ) : !serviceTypes.length ? (
            <Text style={{ paddingHorizontal: 10 }}>No services available</Text>
          ) : (
            serviceTypes.map((service) => {
              const { _id, thumbnail_img, title, app_icon } = service;
              return (
                <View
                  key={_id}
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
                          title: title,
                          service,
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
                              backgroundColor: app_icon.bgColor,
                            },
                          ]}
                        >
                          {createIcon(thumbnail_img, app_icon)}
                        </View>
                        <Text
                          style={{
                            marginHorizontal: 5,
                            fontWeight: "600",
                            textAlign: "center",
                            fontSize: Layouts.isSmallDevice ? 11 : 13,
                          }}
                        >
                          {title}
                        </Text>
                      </React.Fragment>
                    </TouchableHighlight>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

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
