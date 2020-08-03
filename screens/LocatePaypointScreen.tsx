import React, { useState } from "react";
import { StyleSheet, Alert, Text, Platform, Linking } from "react-native";
import Colors from "../constants/Colors";
import { List, ActivityIndicator } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import { connect } from "react-redux";
import { RootReducerI } from "../redux/reducers";
import { PaypointI } from "../models/pay-point";
import { ScrollView } from "react-native-gesture-handler";
import { setPayPoints } from "../redux/actions/pay-points";
import { bindActionCreators } from "redux";
import { fetchPayPoints } from "../models/axios";
import Strings from "../constants/Strings";
import { useNavigation } from "@react-navigation/native";
import { uuid } from "../helpers/functions";
import { LocationI } from "../models/location";

interface LPSI {
  payPoints: PaypointI[];
  provider: any;
  setPayPoints(paypoints: PaypointI[]): void;
}

const LocatePaypointScreen = ({ payPoints, setPayPoints }: LPSI) => {
  const navigator = useNavigation();
  const [loading, setLoading] = useState(false);

  const getPaypoints = () => {
    setLoading(true);
    fetchPayPoints()
      .then(({ status, data }) => {
        // console.log(data.payload);
        if (status === 200 && data.success) {
          setPayPoints(data.payload);
          // console.log(payPoints);
        } else throw new Error();
      })
      .catch((err) => {
        console.log(err);
        Alert.alert(
          Strings.SELF_REPORTING_PROBLEM.title,
          Strings.SELF_REPORTING_PROBLEM.message,
          [{ onPress: () => navigator.navigate(Strings.HomeTabNavigator) }]
        );
      })
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    getPaypoints();
  }, []);

  const openMaps = ({ latitude, longitude }: LocationI) => {
    // let { address, postalCode, city } = {};

    let daddr = encodeURIComponent(`${latitude},${longitude}`);
    console.log(daddr)

    if (Platform.OS === "ios") {
      Linking.openURL(`https://maps.apple.com/maps?daddr=${daddr}`);
    } else {
      Linking.openURL(`https://maps.google.com/maps?daddr=${daddr}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <ActivityIndicator
          style={{ alignSelf: "center", marginTop: 20 }}
          size="large"
          color={Colors.LwscOrange}
        />
      ) : payPoints.length ? (
        payPoints.map((item) => (
          <List.Item
            key={uuid()}
            onPress={() => openMaps(item.coordinates)}
            title={item.title}
            description={item.description}
            left={(props) => (
              <List.Icon
                {...props}
                icon={() => (
                  <Entypo size={25} color={Colors.LwscRed} name="location" />
                )}
              />
            )}
          />
        ))
      ) : (
        <Text style={{ margin: 20 }}>No paypoints defined</Text>
      )}
    </ScrollView>
  );
};

const mapStateToProps = ({ payPoints }: RootReducerI) => ({ payPoints });

const matchPropsToDispatch = (dispatch: any) =>
  bindActionCreators(
    {
      setPayPoints,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  matchPropsToDispatch
)(LocatePaypointScreen);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    // justifyContent: "flex-end",
    // alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    backgroundColor: `${Colors.linkBlue}66`,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  bubbleText: {
    fontWeight: "bold",
  },
  latlng: {
    width: 200,
    alignItems: "stretch",
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
    backgroundColor: "transparent",
  },
});
