import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Dimensions,
  BackHandler,
} from "react-native";
const { width, height } = Dimensions.get("window");
import * as Location from "expo-location";
import Colors from "../../constants/Colors";
import MapView, { Marker } from "react-native-maps";
import Strings from "../../constants/Strings";
import { useNavigation } from "@react-navigation/native";
import { FAB } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const ASPECT_RATIO = width / height;
const LATITUDE = -15.37496;
const LONGITUDE = 28.382121;
const LATITUDE_DELTA = 0.00922;
const LONGITUDE_DELTA = 0.00421; //LATITUDE_DELTA * ASPECT_RATIO;

interface PropI {
  setRegionCallback(region: any): void;
  bubbleText?: string;
}

export default function MapComponent({ setRegionCallback, bubbleText }: PropI) {
  let map: MapView;
  const navigator = useNavigation();
  const { mapContainer, mapStyle } = styles;
  const [isMapReady, setIsMapReady] = useState(false);
  const [region, setRegion] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const getLocationAsync = async () => {
    try {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        const { title, message } = Strings.LOCATION_PERMISSION;
        Alert.alert(title, message, [
          {
            text: "Grant Permission",
            onPress: async () => await getLocationAsync(),
          },
          { text: "Deny", onPress: () => BackHandler.exitApp() },
        ]);
      } else {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });
        const reg = {
          ...region,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setRegion(reg);
        setRegionCallback(reg);
      }
    } catch (error) {
      const { title, message } = Strings.SELF_REPORTING_PROBLEM;
      Alert.alert(title, message, [
        { text: "Ok", onPress: () => navigator.goBack() },
      ]);
    }
  };

  //   useEffect(() => {
  //     if (isMapReady) getLocationAsync();
  //   }, [isMapReady]);

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

  return (
    <View style={mapContainer}>
      <MapView
        ref={(ref) => (map = ref as MapView)}
        zoomEnabled={true}
        showsUserLocation={true}
        region={region}
        onRegionChangeComplete={() => setRegion(region)}
        initialRegion={region}
        style={mapStyle}
        onMapReady={() => setIsMapReady(true)}
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
          coordinate={{
            longitude: region.longitude,
            latitude: region.latitude,
          }}
          pinColor={`${Colors.LwscRed}`}
        />
      </MapView>
      <FAB
        onPress={onPressZoomOut}
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 50,
          backgroundColor: "#ffffff77",
          borderWidth: 0.75,
          borderColor: `${Colors.LwscBlack}01`,
        }}
        small
        icon={({ color }) => (
          <Feather
            name="zoom-in"
            size={25}
            color={color}
            style={{ backgroundColor: "transparent" }}
          />
        )}
      />
      <FAB
        onPress={onPressZoomIn}
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: "#ffffff77",
          borderWidth: 0.75,
          borderColor: `${Colors.LwscBlack}01`,
        }}
        small
        icon={({ color }) => (
          <Feather
            name="zoom-out"
            size={25}
            color={color}
            style={{ backgroundColor: "transparent" }}
          />
        )}
      />
      {bubbleText && bubbleText.length && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.bubble,
              { backgroundColor: `${Colors.LwscBlack}33`, borderRadius: 10 },
            ]}
          >
            <Text style={styles.bubbleText}>
              {bubbleText}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={async () => await getLocationAsync()}
          style={styles.bubble}
        >
          <Text style={styles.bubbleText}>Tap to center to your location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    height: height * 0.55,
  },
  mapStyle: {
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
  fab: {
    backgroundColor: "red",
    position: "absolute",
    zIndex: 999,
    margin: 16,
    right: 0,
    top: 0,
  },
});
