import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  BackHandler,
  Dimensions,
  Platform,
  Picker,
  Modal,
} from "react-native";
import {
  FAB,
  Button,
  TextInput,
  ActivityIndicator,
  Subheading,
} from "react-native-paper";
import Colors from "../constants/Colors";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");

import Strings from "../constants/Strings";
import { InputItemType } from "../types/input-item";
import { connect } from "react-redux";
import { RootReducerI } from "../redux/reducers";
import { PropertyI, BillGroupI, MeterReadingI } from "../models/meter-reading";
import ImageUploadComponent from "./reusable/ImageUploadComponent";
import { UploadFileI } from "../models/upload-file";
import {
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
  SimpleLineIcons,
  Feather,
} from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { bindActionCreators } from "redux";
import {
  setAccessNotes,
  setANAccess,
  setANNotes,
} from "../redux/actions/access-notes";
import { AccessNotesReducerI } from "../redux/reducers/access-notes";
import { NotesI, NoAccessI } from "../models/access-description";
import {
  fetchNoAccessOptions,
  fetchAccessNotes,
  createMeterReading,
} from "../models/axios";
import { formatDate, formatDateTime } from "../helpers/functions";
import { UserReducerI } from "../redux/reducers/user";

const ASPECT_RATIO = width / height;
const LATITUDE = -15.37496;
const LONGITUDE = 28.382121;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421; //LATITUDE_DELTA * ASPECT_RATIO;

export const MeterItem = ({
  icon,
  title,
  value,
}: {
  icon: any;
  title: string;
  value: string | number;
}) => {
  return (
    <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
      <Text style={styles.itemHeader}>{title}</Text>
      <View style={styles.flexRow}>
        {icon}
        <Text style={styles.itemValue}>{value}</Text>
      </View>
    </View>
  );
};

interface PropI {
  user: UserReducerI;
  accessNotes: AccessNotesReducerI;
  setAccessNotes(accessNotes: AccessNotesReducerI): void;
  setANAccess(access: NoAccessI[]): void;
  setANNotes(notes: NotesI[]): void;
  route: {
    params: {
      manNumber: string;
      property: PropertyI;
      billGroup: BillGroupI;
      cycle_id: string;
    };
  };
}

const ReadMeterScreen = ({
  accessNotes,
  setANAccess,
  setANNotes,
  route,
  user,
}: PropI) => {
  let map: MapView;
  const { container, mapContainer, mapStyle } = styles;
  const { manNumber, billGroup, property, cycle_id } = route.params;
  const navigator = useNavigation();
  const [displayItems, setDisplayItems] = useState(accessNotes);
  const [region, setRegion] = React.useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [meterReading, setMeterReading] = useState<InputItemType<number>>({
    value: 0,
    error: false,
  });
  const [note, setNote] = useState({
    value: "-- Select Note --",
    error: false,
  });
  const [access, setAccess] = useState({
    value: "-- Select Access Description --",
    error: false,
  });
  const [loading, setLoading] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<UploadFileI[]>();

  useEffect(() => {
    let is_subscribed = true;

    const bootstrap = async () => {
      setLoading(true);

      try {
        await getLocationAsync();

        if (!accessNotes.no_access.length) {
          const { status, data } = await fetchNoAccessOptions();
          if (status === 200 && data.success) {
            setANAccess(data.payload.recordset);
            displayItems.no_access = data.payload.recordset;
            setDisplayItems(displayItems);
          } else {
            throw new Error("failed to retrieve records");
          }
        }

        if (!accessNotes.notes.length) {
          const { status, data } = await fetchAccessNotes();
          if (status === 200 && data.success) {
            setANNotes(data.payload.recordset);
            // console.log(data.payload.recordset);
            displayItems.notes = data.payload.recordset;
            setDisplayItems(displayItems);
          } else {
            throw new Error("failed to retrieve records");
          }
        }
      } catch (err) {
        Alert.alert(
          Strings.SELF_REPORTING_PROBLEM.title,
          Strings.SELF_REPORTING_PROBLEM.message,
          [{ onPress: () => navigator.navigate(Strings.HomeTabNavigator) }]
        );
      }

      setLoading(false);
    };

    if (is_subscribed) {
      bootstrap();
    }

    return () => {
      is_subscribed = false;
    };
  }, []);

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

  const submitMeterReading = () => {
    const date = new Date();

    const reading: MeterReadingI = {
      bill_group: billGroup.GROUP_ID,
      current_reading: meterReading.value,
      current_reading_date: formatDate(date),
      current_reading_datetime: formatDateTime(date),
      x_gps: region.longitude,
      y_gps: region.latitude,
      access_code: access.value,
      description_code: note.value,
      connection_id: property.connection_id,
      meter_id: property.AccountNumber,
      // staffNumber: manNumber,
      attachements: uploadFiles as UploadFileI[],
      lineNumber: property.lineNumber,
      line_number: property.lineNumber,
      cycle_id,
      token: user.authToken,
    };

    console.log(reading);

    setLoading(true);
    createMeterReading(reading)
      .then(({ status, data }) => {
        if (status === 200 && data.success) {
          Alert.alert(
            Strings.METER_READING_SUBMIT_SUCCESS.title,
            Strings.METER_READING_SUBMIT_SUCCESS.message,
            [{ onPress: () => navigator.navigate(Strings.HomeTabNavigator) }]
          );
        } else {
          throw new Error(JSON.stringify(data));
          // Alert.alert(
          //   Strings.METER_READING_SUBMIT_FAILURE.title,
          //   Strings.METER_READING_SUBMIT_FAILURE.message
          // );
        }
      })
      .catch(() =>
        Alert.alert(
          Strings.SELF_REPORTING_PROBLEM.title,
          Strings.SELF_REPORTING_PROBLEM.message
          // [{ onPress: () => navigator.navigate(Strings.HomeTabNavigator) }]
        )
      )
      .finally(() => setLoading(false));
  };

  return (
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
            <Text style={styles.bubbleText}>Drag marker to your location</Text>
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

      <View style={{ padding: 15 }}>
        <ImageUploadComponent
          buttonName="Capture Meter Reading"
          uploadCallback={setUploadFiles}
          deleteCallback={() => setUploadFiles(undefined)}
        />
        <View>
          <MeterItem
            icon={
              <Ionicons name="ios-person" size={25} color={Colors.linkBlue} />
            }
            title="Man Number"
            value={manNumber}
          />
          <MeterItem
            icon={
              <MaterialCommunityIcons
                size={20}
                color={Colors.linkBlue}
                name="home-group"
              />
            }
            title="Bill Group"
            value={`${billGroup.GROUP_ID} - ${billGroup.DESCRIPTION}`}
          />
          <MeterItem
            icon={
              <Ionicons
                name="md-speedometer"
                size={25}
                color={Colors.linkBlue}
              />
            }
            title="Account-Meter Number"
            value={`${property.AccountNumber}-${property.MeterNumber}`}
          />
          <MeterItem
            icon={
              <Ionicons
                name={`${Platform.OS === "ios" ? "ios" : "md"}-home`}
                size={25}
                color={Colors.linkBlue}
              />
            }
            title="Address"
            value={`${property.PLOT_NO} ${property.Customer_Address}`}
          />
          <MeterItem
            icon={<Entypo name="location" size={20} color={Colors.linkBlue} />}
            title="Township"
            value={property.Township}
          />
          <MeterItem
            icon={
              <MaterialCommunityIcons
                name="timetable"
                size={20}
                color={Colors.linkBlue}
              />
            }
            title="Previous Reading Date"
            value={property.previousReadingDate.toDateString()}
          />
          <MeterItem
            icon={
              <SimpleLineIcons
                name="speedometer"
                size={19}
                color={Colors.linkBlue}
              />
            }
            title="Previous Reading"
            value={property.PreviousReading}
          />
        </View>

        <TextInput
          style={{ marginTop: 10, backgroundColor: "white" }}
          disabled={loading}
          mode="outlined"
          label={"Meter Reading"}
          value={meterReading.value.toString()}
          error={meterReading.error}
          onChangeText={(value) => {
            const val = parseFloat(value);
            setMeterReading({
              value: isNaN(val) ? 0 : val,
              error: isNaN(val) || val < property.PreviousReading,
            });
          }}
        />

        <View
          style={{
            borderWidth: 1,
            borderBottomColor: Colors.borderColorDark,
            borderStyle: "solid",
            borderRadius: 5,
            marginTop: 10,
          }}
        >
          <Picker
            selectedValue={access.value}
            onValueChange={(itemValue, index) => {
              setAccess({
                value: itemValue,
                error: !displayItems.no_access.some(
                  (value) => value.DESCRIBE === itemValue
                ),
              });
            }}
          >
            <Picker.Item
              label="-- Select Access Description --"
              value="-- Select Access Description --"
            />
            {displayItems.no_access.map((noac) => {
              // console.log(noac);
              return (
                <Picker.Item
                  key={`${noac.DESCRIBE}_${noac.code}`}
                  label={noac.DESCRIBE}
                  value={noac.DESCRIBE}
                />
              );
            })}
          </Picker>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderBottomColor: Colors.borderColorDark,
            borderStyle: "solid",
            borderRadius: 5,
            marginTop: 10,
          }}
        >
          <Picker
            selectedValue={note.value}
            onValueChange={(itemValue, index) => {
              setNote({
                value: itemValue,
                error: !displayItems.notes.some(
                  (value) => value.DESCRIBE === itemValue
                ),
              });
            }}
          >
            <Picker.Item label="-- Select Note --" value="-- Select Note --" />
            {displayItems.notes.map((an) => (
              <Picker.Item
                key={`${an.DESCRIBE}_${an.CODE}`}
                label={an.DESCRIBE}
                value={an.DESCRIBE}
              />
            ))}
          </Picker>
        </View>

        {(meterReading.error ||
          meterReading.value === 0 ||
          note.value === "-- Select Note --" ||
          note.error ||
          access.value === "-- Select Access Description --" ||
          access.error ||
          !uploadFiles ||
          !uploadFiles.length) && (
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
            {!uploadFiles || !uploadFiles.length
              ? "Ensure you capture the meter reading"
              : meterReading.error || meterReading.value === 0
              ? "Ensure meter reading is greater or equal to previous reading"
              : access.value === "-- Select Access Description --" ||
                access.error
              ? "Ensure you select an access description"
              : note.value === "-- Select Note --" || note.error
              ? "Ensure you select a note"
              : ""}
          </Subheading>
        )}

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
            meterReading.error ||
            meterReading.value === 0 ||
            note.value === "-- Select Note --" ||
            note.error ||
            access.value === "-- Select Access Description --" ||
            access.error ||
            !uploadFiles ||
            !uploadFiles.length
          }
          mode="outlined"
          onPress={submitMeterReading}
        >
          Submit Reading
        </Button>
      </View>
    </ScrollView>
  );
};

const mapStateToProps = ({ user, accessNotes }: RootReducerI) => ({
  user,
  accessNotes,
});

const matchDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      setAccessNotes,
      setANAccess,
      setANNotes,
    },
    dispatch
  );

export default connect(mapStateToProps, matchDispatchToProps)(ReadMeterScreen);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
  },
  fab: {
    backgroundColor: "red",
    position: "absolute",
    zIndex: 999,
    margin: 16,
    right: 0,
    top: 0,
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  itemHeader: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
    color: "#000000aa",
  },
  itemValue: {
    marginLeft: 10,
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
