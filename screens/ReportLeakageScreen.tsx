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
import { TextInput, Button, FAB, Checkbox } from "react-native-paper";
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
import { LinearGradient } from "expo-linear-gradient";
import MapComponent from "./reusable/MapComponent";

const ReportLeakageScreen = () => {
  let map: MapView;
  const navigator = useNavigation();
  const { container, flexRow } = styles;
  const [region, setRegion] = React.useState({ longitude: 0, latitude: 0 });
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
  const [leakages, setLeakages] = useState({ water: true, sewer: false });
  const [isMapReady, setIsMapReady] = useState(false);

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
      leakage_types:
        leakages.water && leakages.sewer
          ? ["sewer", "water"]
          : leakages.sewer
          ? ["sewer"]
          : leakages.water
          ? ["water"]
          : [],
    });
    navigator.navigate(Strings.SelectAreaScreen, {
      application: report,
      toRoute: Strings.RequestServiceScreen,
    });
  };

  return (
    <LinearGradient
      start={[0, 0]}
      end={[1, 0]}
      colors={["#56cbf1", "#5a86e4"]}
      style={{ display: "flex", flex: 1 }}
    >
      <ScrollView style={container}>
        <MapComponent setRegionCallback={setRegion} bubbleText="Drag marker to location of the leak"/>
        <View style={{ paddingVertical: 15, paddingHorizontal: 15 }}>
          <ImageUploadComponent
            contentStyle={{ backgroundColor: "#fff" }}
            uploadCallback={setUploadFiles}
          />
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
          <Checkbox.Item
            style={{
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
              borderColor: `${Colors.linkBlue}22`,
              backgroundColor: "#fff",
            }}
            color={Colors.linkBlue}
            labelStyle={{ color: "#000" }}
            label="Sewer Leak"
            onPress={() => setLeakages({ ...leakages, sewer: !leakages.sewer })}
            status={leakages.sewer ? "checked" : "unchecked"}
          />
          <Checkbox.Item
            style={{
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
              borderColor: `${Colors.linkBlue}22`,
              backgroundColor: "#fff",
            }}
            color={Colors.linkBlue}
            labelStyle={{ color: "#000" }}
            label="Water Leak"
            onPress={() => setLeakages({ ...leakages, water: !leakages.water })}
            status={leakages.water ? "checked" : "unchecked"}
          />

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
    </LinearGradient>
  );
};

export default ReportLeakageScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    ...StyleSheet.absoluteFillObject,
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
    // backgroundColor: "red",
    position: "absolute",
    zIndex: 999,
    margin: 16,
    right: 0,
    top: 0,
  },
});
