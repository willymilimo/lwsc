import React from "react";
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
import MapView, { Marker, ProviderPropType } from "react-native-maps";
import Colors from "../constants/Colors";
const { width, height } = Dimensions.get("window");
import Strings from "../constants/Strings";

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

const LocatePaypointScreen = ({ provider }: any) => {
  const [markers, setMarkers] = React.useState<any[]>([]);
  const [region, setRegion] = React.useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const onMapPress = (e: any) => {
    setMarkers([
      ...markers,
      {
        coordinate: e.nativeEvent.coordinate,
        key: id++,
        color: randomColor(),
      },
    ]);
  };

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
      console.log(location.coords);
      // console.log(this.state.region);
      setRegion({
        ...region,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  };

  React.useEffect(() => {
    getLocationAsync();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        provider={provider}
        style={styles.map}
        region={region}
        onPress={(e) => onMapPress(e)}
      >
        {/* <Marker
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
        ))} */}
        <MapViewDirections
          origin={{ latitude: -15.37496, longitude: 28.382121 }}
          destination={{ latitude: -15.412123, longitude: 28.303703 }}
          apikey={Strings.GOOGLE_MAP_API_KEY}
        />
      </MapView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={async () => {
            setMarkers([]);
            await getLocationAsync();
          }}
          style={styles.bubble}
        >
          <Text>Tap to center to my location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

LocatePaypointScreen.propTypes = {
  provider: ProviderPropType,
};

export default LocatePaypointScreen;

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
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
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
