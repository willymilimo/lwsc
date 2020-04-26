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
import MapView, { Marker, ProviderPropType } from "react-native-maps";
const { width, height } = Dimensions.get("window");

function randomColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
}

const ASPECT_RATIO = width / height;
const LATITUDE = -5.3875259;
const LONGITUDE = 8.328165;
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

  React.useEffect(() => {
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
          pinColor={randomColor()}
        />
        {markers.map((marker: any) => (
          <Marker
            key={marker.key}
            coordinate={marker.coordinate}
            pinColor={marker.color}
          />
        ))}
      </MapView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => setMarkers([])} style={styles.bubble}>
          <Text>Tap to create a marker of random color</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

LocatePaypointScreen.propTypes = {
  provider: ProviderPropType,
};

export default LocatePaypointScreen;

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
