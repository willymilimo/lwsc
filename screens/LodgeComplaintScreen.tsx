import React from "react";
import { StyleSheet, Text, View, Dimensions, Alert } from "react-native";
import { InputItemType } from "../types/input-item";
import { TextInput, Button, FAB } from "react-native-paper";
import * as Location from "expo-location";
import Colors from "../constants/Colors";
import MapView, { Marker } from "react-native-maps";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import Regex from "../constants/Regex";
const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE = -15.37496;
const LONGITUDE = 28.382121;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421; //LATITUDE_DELTA * ASPECT_RATIO;

const LodgeComplaintScreen = () => {
  let map: MapView;
  const { container, formContainer, mapContainer } = styles;
  const [region, setRegion] = React.useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [loading, setLoading] = React.useState(false);
  const [fullName, setFullName] = React.useState<InputItemType<string>>({
    value: "",
    error: false,
  });
  const [phone, setPhone] = React.useState<InputItemType<string>>({
    value: "",
    error: false,
  });
  const [meterAccountNumber, setMeterAccountNumber] = React.useState<
    InputItemType<string>
  >({
    value: "",
    error: false,
  });
  const [message, setMessage] = React.useState<InputItemType<string>>({
    value: "",
    error: false,
  });

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
      //   console.log(location.coords);
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
    <ScrollView style={container}>
      <View style={mapContainer}>
        <MapView
          ref={(ref) => (map = ref as MapView)}
          zoomEnabled={true}
          showsUserLocation={true}
          region={region}
          onRegionChangeComplete={() => setRegion(region)}
          initialRegion={region}
          style={styles.map}
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
            backgroundColor: "#ffffff77",
            borderWidth: 0.75,
            borderColor: `${Colors.LwscBlack}01`,
          }}
          small
          icon={({ color }) => (
            <Feather name="zoom-in" size={25} color={color} />
          )}
        />
        {/* <TouchableOpacity
          style={styles.zoomIn}
          onPress={(onPressZoomIn}
        >
          <Icon
            name="add"
            style={styles.icon}
            size={20}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.zoomOut}
          onPress={onPressZoomOut}
        >
          <Icon
            name="remove"
            style={styles.icon}
            size={20}
          />
        </TouchableOpacity> */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.bubble,
              { backgroundColor: `${Colors.LwscBlack}33`, borderRadius: 10 },
            ]}
          >
            <Text style={styles.bubbleText}>
              Drag marker to location of the complaint (optional)
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={async () => await getLocationAsync()}
            style={styles.bubble}
          >
            <Text style={styles.bubbleText}>
              Tap to center to your location
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={formContainer}>
        <TextInput
          disabled={loading}
          autoFocus={true}
          mode="outlined"
          label={"Full Name"}
          value={fullName.value}
          style={{ backgroundColor: "white" }}
          error={fullName.error}
          onChangeText={(value) => {
            setFullName({
              value,
              error: Regex.NAME.test(value),
            });
          }}
        />
        <TextInput
          style={{ marginTop: 15, backgroundColor: "white" }}
          disabled={loading}
          mode="outlined"
          label={"Account/Meter Number"}
          value={meterAccountNumber.value}
          error={meterAccountNumber.error}
          onChangeText={(value) =>
            setMeterAccountNumber({
              value,
              error: /\d{5,}/.test(value.length.toString()),
            })
          }
        />
        <TextInput
          style={{ marginTop: 15, backgroundColor: "white" }}
          disabled={loading}
          mode="outlined"
          label={"Phone Number"}
          placeholder="e.g. +2609548900"
          value={phone.value}
          error={phone.error}
          onChangeText={(value) => {
            setPhone({
              value,
              error: Regex.PHONE_NUMBER.test(value),
            });
          }}
        />
        <TextInput
          disabled={loading}
          style={{ marginTop: 15, backgroundColor: "white" }}
          multiline={true}
          numberOfLines={10}
          mode="outlined"
          label={"Your complaint"}
          value={message.value}
          error={message.error}
          onChangeText={(value) =>
            setMessage({ value, error: value.length < 10 })
          }
        />
        <Button
          style={{ marginTop: 15 }}
          contentStyle={{
            borderColor: Colors.linkBlue,
            borderWidth: 0.75,
            borderRadius: 5,
            backgroundColor: `${Colors.linkBlue}22`,
          }}
          color={`${Colors.LwscBlue}bb`}
          loading={loading}
          disabled={
            loading ||
            meterAccountNumber.error ||
            phone.error ||
            phone.value.length === 0 ||
            fullName.error ||
            fullName.value.length === 0 ||
            message.error ||
            message.value.length === 0
          }
          icon="send"
          mode="outlined"
          onPress={() => {}}
        >
          Submit
        </Button>
      </View>
    </ScrollView>
  );
};

export default LodgeComplaintScreen;

const styles = StyleSheet.create({
  formContainer: {
    // flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  container: {
    display: "flex",
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
  },
  mapContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    height: height * 0.55,
    // flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonStyle: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    position: "absolute",
    bottom: 15,
    right: 15,
    borderWidth: 0.5,
    borderColor: Colors.linkBlue,
    backgroundColor: `${Colors.linkBlue}22`,
    zIndex: 999,
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
