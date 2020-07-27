import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import Constants from "expo-constants";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import MapView, { Marker } from "react-native-maps";
import Colors from "../constants/Colors";
const { width, height } = Dimensions.get("window");
import Strings from "../constants/Strings";
import { FAB, Menu, Button } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { connect } from "react-redux";
import { RootReducerI } from "../redux/reducers";
import { PayPointReducer } from "../types/paypoint";
import { PayPointI } from "../models/pay-point";

function randomColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
}

const ASPECT_RATIO = width / height;
const LATITUDE = -15.37496;
const LONGITUDE = 28.382121;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

interface LPSI {
  payPoints: PayPointReducer;
  provider: any;
}

const LocatePaypointScreen = ({ provider, payPoints }: LPSI) => {
  let map: MapView;
  const [markers, setMarkers] = React.useState<any[]>([]);
  const [region, setRegion] = React.useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [showMenu, setShowMenu] = useState(false);
  const [regionalPayPoints, setRegionalPayPoints] = useState<PayPointI[]>([]);

  const getLocationAsync = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      // setErrorMsg("Permission to access location was denied");
      Alert.alert(
        "Location Permission",
        "We require permission access to show you the nearest paypoints.",
        [{ text: "OK", onPress: async () => await getLocationAsync() }],
        { cancelable: false }
      );
    } else {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      // console.log(location.coords);
      // console.log(this.state.region);
      setRegion({
        ...region,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  };

  const onPressZoomOut = () => {
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta / 10,
      longitudeDelta: region.longitudeDelta / 10,
    });
    map.animateToRegion(region, 100);
  };

  const onPressZoomIn = () => {
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta * 10,
      longitudeDelta: region.longitudeDelta * 10,
    });
    map.animateToRegion(region, 100);
  };

  React.useEffect(() => {
    getLocationAsync();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={(ref) => (map = ref as MapView)}
        zoomEnabled={true}
        showsUserLocation={true}
        provider={provider}
        style={styles.map}
        region={region}
        onRegionChangeComplete={() => setRegion(region)}
      >
        <Marker
          draggable
          onDragEnd={(e) =>
            setRegion({
              ...region,
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
            })
          }
          key={randomColor()}
          coordinate={{
            longitude: region.longitude,
            latitude: region.latitude,
          }}
          pinColor={`${Colors.LwscRed}`}
        />
        {markers.map((marker: any) => (
          <Marker
            draggable
            key={marker.key}
            coordinate={marker.coordinate}
            pinColor={marker.color}
          />
        ))}
        <MapViewDirections
          origin={region}
          destination={{ latitude: -15.412123, longitude: 28.303703 }}
          apikey={Strings.GOOGLE_MAP_API_KEY}
        />
      </MapView>

      <FAB
        onPress={onPressZoomOut}
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 50,
          backgroundColor: "#ffffff",
          borderWidth: 0.75,
          borderColor: `${Colors.LwscBlack}01`,
        }}
        small
        icon={({ color }) => (
          <Feather name="zoom-out" size={25} color={color} />
        )}
      />
      <FAB
        onPress={onPressZoomIn}
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: "#ffffff",
          borderWidth: 0.75,
          borderColor: `${Colors.LwscBlack}01`,
        }}
        small
        icon={({ color }) => <Feather name="zoom-in" size={25} color={color} />}
      />

      <View style={{ position: "absolute", top: 10, right: 10 }}>
        <Menu
          visible={showMenu}
          onDismiss={() => setShowMenu(false)}
          anchor={
            <Button mode={"contained"} onPress={() => setShowMenu(true)}>
              Filter by Location
            </Button>
          }
        >
          {Object.keys(payPoints)
            .sort()
            .map((p, i) => (
              <Menu.Item
                key={p}
                onPress={() => {
                  setShowMenu(false);
                  setRegionalPayPoints(payPoints[p]);
                }}
                title={p}
              />
            ))}
        </Menu>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={async () => {
            setMarkers([]);
            await getLocationAsync();
          }}
          style={styles.bubble}
        >
          <Text style={styles.bubbleText}>Tap to center to your location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// LocatePaypointScreen.propTypes = {
//   provider: ProviderPropType,
// };
const mapStateToProps = ({ payPoints }: RootReducerI) => ({ payPoints });

export default connect(mapStateToProps)(LocatePaypointScreen);

const aa = [
  { name: "CHELSTON OFFICE", latitude: -15.37496, longitude: 28.382121 },
  { name: "HEAD OFFICE", latitude: -15.412123, longitude: 28.303703 },
  { name: "LUMUMBA BRANCH", latitude: -15.415724, longitude: 28.282466 },
];

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
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
