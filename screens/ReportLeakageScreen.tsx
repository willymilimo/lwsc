import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
  BackHandler,
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import Colors from "../constants/Colors";
import { TextInput, Button, FAB } from "react-native-paper";
import { ControlIT } from "../models/control";
import Strings from "../constants/Strings";
const { width, height } = Dimensions.get("window");

import { useNavigation } from "@react-navigation/native";
import Regex from "../constants/Regex";
import ImageUploadComponent from "./reusable/ImageUploadComponent";
import { UploadFileI } from "../models/upload-file";
import { ServiceReportI, ServiceReport } from "../models/service-report";
import { reportLeakage } from "../models/axios";
import { Feather } from "@expo/vector-icons";
import { BookNumberI } from "../models/meter-reading";

const ASPECT_RATIO = width / height;
const LATITUDE = -15.37496;
const LONGITUDE = 28.382121;
const LATITUDE_DELTA = 0.00922;
const LONGITUDE_DELTA = 0.00421; //LATITUDE_DELTA * ASPECT_RATIO;

const ReportLeakageScreen = () => {
  let map: MapView;
  const navigator = useNavigation();
  const { container, mapContainer, mapStyle, flexRow } = styles;
  const [region, setRegion] = React.useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [fullName, setFullName] = React.useState<ControlIT<string>>({
    value: "",
    error: false,
  });
  const [phone, setPhone] = React.useState<ControlIT<string>>({
    value: "",
    error: false,
  });
  const [meterAccountNumber, setMeterAccountNumber] = React.useState<
    ControlIT<string>
  >({
    value: "",
    error: false,
  });
  const [description, setDescription] = useState({ value: "", error: false });
  const [email, setEmail] = useState({ value: "", error: false });
  const [area, setArea] = useState({ value: "", error: false });
  const [address, setAddress] = useState({ value: "", error: false });
  // const [image, setImage] = useState<string | null>(null);
  const [uploadFiles, setUploadFiles] = useState<UploadFileI[]>();
  const [loading, setLoading] = useState(false);

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
        setRegion({
          ...region,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (error) {
      const { title, message } = Strings.SELF_REPORTING_PROBLEM;
      Alert.alert(title, message, [
        { text: "Ok", onPress: () => navigator.goBack() },
      ]);
    }
  };

  useEffect(() => {
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

  const onSelectCallback = (
    bookNumber: BookNumberI,
    complaint: ServiceReportI
  ) => {
    navigator.navigate(Strings.RequestServiceScreen, {
      bookNumber: bookNumber,
      item: complaint,
    });
  };

  const handleReportLeakageSubmit = () => {
    const space = fullName.value.indexOf(" ");
    const report: ServiceReportI = new ServiceReport({
      first_name:
        space != -1 ? fullName.value.substring(0, space) : fullName.value,
      last_name:
        space != -1 ? fullName.value.substring(space).trim() : fullName.value,
      phone: phone.value,
      coordinates: region,
      area: "",
      email: email.value,
      address: address.value,
      account_number: meterAccountNumber.value,
      meter_number: meterAccountNumber.value,
      description: description.value,
      files: uploadFiles as UploadFileI[],
    });
    navigator.navigate(Strings.SelectAreaScreen, {
      application: report,
      onSelectCallback,
    });
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
          style={mapStyle}
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

      <View style={{ paddingVertical: 15, paddingHorizontal: 15 }}>
        <ImageUploadComponent uploadCallback={setUploadFiles} />
        <TextInput
          style={{ marginTop: 10 }}
          mode="outlined"
          label="Full Name"
          placeholder="e.g. Moses Chinthalima"
          value={fullName.value}
          error={fullName.error}
          disabled={loading}
          onChangeText={(value) => {
            setFullName({
              value,
              error: !Regex.NAME.test(value),
            });
          }}
        />

        <TextInput
          style={{ marginTop: 10 }}
          mode="outlined"
          label="Phone Number"
          placeholder="e.g. +260950039290"
          value={phone.value}
          error={phone.error}
          disabled={loading}
          onChangeText={(value) => {
            setPhone({
              value,
              error: !Regex.PHONE_NUMBER.test(value),
            });
          }}
        />
        <TextInput
          style={{ marginTop: 10 }}
          disabled={loading}
          mode="outlined"
          label={"Email Address (optional)"}
          value={email.value}
          error={email.error}
          onChangeText={(value) =>
            setEmail({
              value,
              error: value.length > 0 && !Regex.EMAIL.test(value),
            })
          }
        />
        <TextInput
          style={{ marginTop: 10 }}
          disabled={loading}
          mode="outlined"
          label={"Account/Meter Number (optional)"}
          value={meterAccountNumber.value}
          error={meterAccountNumber.error}
          onChangeText={(value) =>
            setMeterAccountNumber({
              value,
              error: value.length > 0 && value.length < 5,
            })
          }
        />
        <TextInput
          style={{ marginTop: 10 }}
          disabled={loading}
          mode="outlined"
          label={"Address (optional)"}
          value={address.value}
          error={address.error}
          onChangeText={(value) =>
            setAddress({
              value,
              error: value.length > 0 && value.length < 5,
            })
          }
        />
        <TextInput
          style={{ marginTop: 10 }}
          disabled={loading}
          mode="outlined"
          label={"Description (optional)"}
          value={description.value}
          error={description.error}
          multiline={true}
          numberOfLines={5}
          onChangeText={(value) =>
            setDescription({
              value,
              error: value.length > 0 && value.length < 5,
            })
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
          //   icon="send"
          disabled={
            loading ||
            meterAccountNumber.error ||
            email.error ||
            address.error ||
            phone.error ||
            phone.value.length === 0 ||
            fullName.error ||
            fullName.value.length === 0
          }
          mode="outlined"
          onPress={handleReportLeakageSubmit}
        >
          Continue
        </Button>
      </View>
    </ScrollView>
  );
};

export default ReportLeakageScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
  },
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
