import React from "react";
import { StyleSheet, Text, View, Dimensions, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Constants from "expo-constants";
import * as Location from "expo-location";

const LocatePaypointScreen = () => {
  const [location, setLocation] = React.useState<Location.LocationData | null>(
    null
  );
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    getLocationAsync();
  });

  const getLocationAsync = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      Alert.alert(
        "Location Permission",
        "We require permission access to show you the nearest paypoints.",
        [{ text: "OK", onPress: async () => await getLocationAsync() }],
        { cancelable: false }
      );
    } else {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        initialRegion={{
          latitude: -15.3875259,
          longitude: 28.328165,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={styles.mapStyle}
      />
      {markers.map(({ latlng, title }) => (
        <Marker
          key={`${latlng.latitude}_${latlng.longitude}`}
          coordinate={latlng}
          title={title}
          description={title}
        />
      ))}
    </View>
  );
};

const markers = [
  {
    latlng: { latitude: -15.3875259, longitude: 28.328165 },
    title: "Some Location",
  },
  {
    latlng: { latitude: -15.4228722, longitude: 28.34433372 },
    title: "Melisa",
  },
  {
    latlng: { latitude: -15.44460389, longitude: 28.3474732 },
    title: "Woodlands Stadium",
  },
];

export default LocatePaypointScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
