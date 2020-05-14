import React from "react";
import { StyleSheet, Text, View, Dimensions, Alert } from "react-native";
import { ServiceType } from "../../types/service-type";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Colors from "../../constants/Colors";
import { Button, TextInput } from "react-native-paper";
import { ControlIT } from "../../models/control";
const { width, height } = Dimensions.get("window");

interface GeneralServiceFormI {
  navigation: any;
  route: { params: { title: string; type: ServiceType } };
}

const ASPECT_RATIO = width / height;
const LATITUDE = -15.37496;
const LONGITUDE = 28.382121;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421; //LATITUDE_DELTA * ASPECT_RATIO;

const GeneralServiceForm = ({ navigation, route }: GeneralServiceFormI) => {
  const { title, type } = route.params;
  const { container, mapContainer, map } = styles;
  const [region, setRegion] = React.useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [loading, setLoading] = React.useState(false);
  const [fullName, setFullName] = React.useState<ControlIT<string>>({
    value: "",
    error: false,
  });
  const [phone, setPhone] = React.useState<ControlIT<string>>({
    value: "",
    error: false,
  });
  const [email, setEmail] = React.useState<ControlIT<string>>({
    value: "",
    error: false,
  });
  const [address, setAddress] = React.useState<ControlIT<string>>({
    value: "",
    error: false,
  });
  const [account_meter, setAccountMeter] = React.useState<ControlIT<string>>({
    value: "",
    error: false,
  });
  const [description, setDescription] = React.useState<ControlIT<string>>({
    value: "",
    error: false,
  });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: title,
    });
  }, [navigation]);

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

  return (
    <ScrollView style={container}>
      <View style={mapContainer}>
        <MapView
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
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.bubble,
              { backgroundColor: `${Colors.LwscBlack}33`, borderRadius: 10 },
            ]}
          >
            <Text style={styles.bubbleText}>
              Drag marker to location of the leak
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={async () => await getLocationAsync()}
            style={styles.bubble}
          >
            <Text style={styles.bubbleText}>Tap to center to my location</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ paddingVertical: 10, paddingHorizontal: 15 }}>
        <TextInput
          mode="outlined"
          label="Full Name"
          placeholder="e.g. Moses Chinthalima"
          value={fullName.value}
          error={fullName.error}
          disabled={loading}
          onChangeText={(text) => {}}
        />

        <TextInput
          style={{ marginTop: 10 }}
          mode="outlined"
          label="Phone Number"
          placeholder="e.g. +260950039290"
          value={phone.value}
          error={phone.error}
          disabled={loading}
          onChangeText={(text) => {}}
        />

        <TextInput
          style={{ marginTop: 10 }}
          mode="outlined"
          label="Email Address"
          placeholder="e.g. mchola@lwsc.co.zm"
          value={email.value}
          error={email.error}
          disabled={loading}
          onChangeText={(text) => {}}
        />

        <TextInput
          style={{ marginTop: 10 }}
          multiline={true}
          numberOfLines={3}
          mode="outlined"
          label="Residential Address"
          placeholder="e.g. Plot 5, off Alick Nkhata Road"
          value={address.value}
          error={address.error}
          disabled={loading}
          onChangeText={(text) => {}}
        />

        <TextInput
          style={{ marginTop: 10 }}
          mode="outlined"
          label="Account/Meter Number (optional)"
          placeholder="e.g. 1020893"
          value={account_meter.value}
          error={account_meter.error}
          disabled={loading}
          onChangeText={(text) => {}}
        />

        <TextInput
          style={{ marginTop: 10 }}
          multiline={true}
          numberOfLines={3}
          mode="outlined"
          label="Description (optional)"
          placeholder="e.g. Requesting service xxxx and xxxx due to such and such"
          value={description.value}
          error={description.error}
          disabled={loading}
          onChangeText={(text) => {}}
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
          //   icon="send"
          mode="outlined"
          onPress={() => {}}
        >
          Request Service
        </Button>
      </View>
    </ScrollView>
  );
};

export default GeneralServiceForm;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
  },
  mapContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    height: height * 0.5,
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
