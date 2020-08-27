import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
  Modal,
  Picker,
} from "react-native";
import { ServiceType } from "../../types/service-type";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Colors from "../../constants/Colors";
import {
  Button,
  TextInput,
  FAB,
  ActivityIndicator,
  Subheading,
} from "react-native-paper";
import { ControlIT } from "../../models/control";
import Regex from "../../constants/Regex";
import {
  ServiceApplicationI,
  ServiceApplication,
} from "../../models/service-application";
import Strings from "../../constants/Strings";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ServiceItemI } from "../../models/service-item";
import { BookNumberI } from "../../models/meter-reading";
import { ServiceReportI } from "../../models/service-report";
import { LinearGradient } from "expo-linear-gradient";
const { width, height } = Dimensions.get("window");

interface GeneralServiceFormI {
  navigation: any;
  route: { params: { title: string; service: ServiceItemI } };
}

const ASPECT_RATIO = width / height;
const LATITUDE = -15.37496;
const LONGITUDE = 28.382121;
const LATITUDE_DELTA = 0.00922;
const LONGITUDE_DELTA = 0.00921; //LATITUDE_DELTA * ASPECT_RATIO;

export default function GeneralServiceForm({
  navigation,
  route,
}: GeneralServiceFormI) {
  let mapRef: MapView;
  const navigator = useNavigation();
  const { title, service } = route.params;
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

  // console.log(service);

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

  const handleProceedButton = () => {
    const name = fullName.value.split(" ");
    const first_name = name[0];
    let last_name = first_name;
    if (name.length > 1) {
      name.reverse().pop();
      last_name = name.reverse().toString();
    }
    const application: ServiceApplicationI = new ServiceApplication({
      service_type: service._id,
      first_name,
      last_name,
      phone: phone.value,
      email: email.value,
      loc_coordinates: region,
      coordinates: region,
      address: address.value,
      description: description.value,
      meter_number: account_meter.value,
      account_number: account_meter.value,
      customer_account_id: account_meter.value,
      customer_id: account_meter.value,
      post_service: service.billable,
      fullname: "",
      post_to_customer_balance: false,
      payment_channel: "",
      billable: service.billable,
    });

    navigator.navigate(Strings.SelectAreaScreen, {
      application,
      toRoute: Strings.RequestServiceScreen,
    });
  };

  const onPressZoomOut = () => {
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta / 10,
      longitudeDelta: region.longitudeDelta / 10,
    });
    mapRef.animateToRegion(region, 100);
  };

  const onPressZoomIn = () => {
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta * 10,
      longitudeDelta: region.longitudeDelta * 10,
    });
    mapRef.animateToRegion(region, 100);
  };

  const invalidPostService =
    service.billable &&
    (account_meter.error || account_meter.value.length === 0);

  return (
    <LinearGradient
      start={[0, 0]}
      end={[1, 0]}
      colors={["#56cbf1", "#5a86e4"]}
      style={{ display: "flex", flex: 1 }}
    >
      <ScrollView style={container}>
        <Modal animationType="slide" transparent visible={loading}>
          <View style={[styles.centeredView, { backgroundColor: "#00000077" }]}>
            <View style={styles.modalView}>
              <ActivityIndicator size="large" color={Colors.LwscOrange} />
            </View>
          </View>
        </Modal>

        <View style={mapContainer}>
          <MapView
            ref={(ref) => (mapRef = ref as MapView)}
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
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.bubble,
                { backgroundColor: `${Colors.LwscBlack}33`, borderRadius: 10 },
              ]}
            >
              <Text style={styles.bubbleText}>
                Drag marker to location requiring the service
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

        <View style={{ paddingVertical: 10, paddingHorizontal: 15 }}>
          <TextInput
            mode="outlined"
            label="Full Name"
            placeholder="e.g. Moses Chinthalima"
            value={fullName.value}
            error={fullName.error}
            disabled={loading}
            onChangeText={(text) =>
              setFullName({
                value: text,
                error: !Regex.NAME.test(text),
              })
            }
          />

          <TextInput
            style={{ marginTop: 10 }}
            mode="outlined"
            label="Phone Number"
            placeholder="e.g. +260950039290"
            value={phone.value}
            error={phone.error}
            disabled={loading}
            onChangeText={(text) =>
              setPhone({
                value: text,
                error: !Regex.ZAMBIAN_PHONE_NUMBER.test(text),
              })
            }
          />

          <TextInput
            style={{ marginTop: 10 }}
            mode="outlined"
            label="Email Address (optional)"
            placeholder="e.g. mchola@lwsc.co.zm"
            value={email.value}
            error={email.error}
            disabled={loading}
            onChangeText={(text) =>
              setEmail({
                value: text,
                error: text.length > 0 && !Regex.EMAIL.test(text),
              })
            }
          />

          <TextInput
            style={{ marginTop: 10 }}
            multiline={true}
            numberOfLines={3}
            mode="outlined"
            label="Address"
            placeholder="e.g. Plot 5, off Alick Nkhata Road, Mass Media"
            value={address.value}
            error={address.error}
            disabled={loading}
            onChangeText={(text) =>
              setAddress({
                value: text,
                error: text.length < 10,
              })
            }
          />

          <TextInput
            style={{ marginTop: 10 }}
            mode="outlined"
            label="Account Number"
            placeholder="e.g. 1020893"
            value={account_meter.value}
            error={account_meter.error}
            disabled={loading}
            onChangeText={(text) =>
              setAccountMeter({
                value: text,
                error: text.length > 0 && !/^\d{5,}$/g.test(text),
              })
            }
          />

          <TextInput
            style={{ marginTop: 10 }}
            multiline={true}
            numberOfLines={3}
            mode="outlined"
            label="Description (optional)"
            placeholder="e.g. Requesting service xxxx and xxxx due to such and such"
            value={description.value} //5f44c0a202f336bb804956d1
            error={description.error}
            disabled={loading}
            onChangeText={(text) =>
              setDescription({
                value: text,
                error: text.length > 0 && text.length < 5,
              })
            }
          />

          {(fullName.error ||
            fullName.value.length === 0 ||
            phone.error ||
            phone.value.length === 0 ||
            address.error ||
            address.value.length === 0 ||
            account_meter.value.length === 0 ||
            account_meter.error ||
            invalidPostService) && (
            <Subheading
              style={{
                color: "maroon",
                borderColor: Colors.danger.border,
                backgroundColor: Colors.danger.background,
                padding: 8,
                borderRadius: 5,
                textAlign: "center",
                marginTop: 10,
              }}
            >
              {fullName.error || fullName.value.length === 0
                ? "Full Name is required"
                : phone.error || phone.value.length === 0
                ? "Please input valid Phone Number"
                : address.error || address.value.length === 0
                ? "Address is required"
                : invalidPostService
                ? "Account Number is required"
                : ""}
            </Subheading>
          )}

          <Button
            style={{ marginTop: 15 }}
            contentStyle={{
              borderColor: Colors.linkBlue,
              borderWidth: 0.75,
              borderRadius: 5,
              backgroundColor: `${Colors.whiteColor}`,
            }}
            labelStyle={{ color: Colors.linkBlue }}
            color={`${Colors.whiteColor}`}
            disabled={
              loading ||
              fullName.error ||
              fullName.value.length === 0 ||
              phone.error ||
              phone.value.length === 0 ||
              address.error ||
              address.value.length === 0 ||
              invalidPostService
            }
            loading={loading}
            //   icon="send"
            mode="outlined"
            onPress={handleProceedButton}
          >
            Proceed
          </Button>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: "white",
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
