import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert, Picker } from "react-native";
import { ConsumptionI, Consumption } from "../models/consumption";
import { PropertyI, Property } from "../models/meter-reading";
import { AccountI, Account } from "../models/account";
import { fetchComsumption } from "../models/axios";
import {
  Button,
  Subheading,
  ActivityIndicator,
  List,
  Portal,
  Modal,
  Provider,
  Menu,
  Divider,
} from "react-native-paper";
import { Calendar } from "react-native-calendars";
import Colors from "../constants/Colors";
import { formatDate, uuid } from "../helpers/functions";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import ConsumptionSVG from "../assets/consumption.svg";
import FeacalSludgeMgt from "../assets/feacal_sludge_mgt.svg";
import Strings from "../constants/Strings";
import { useNavigation } from "@react-navigation/native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const months = [
  { month: "January", days: 31, num: "01" },
  { month: "February", days: 28, num: "02" },
  { month: "March", days: 31, num: "03" },
  { month: "April", days: 30, num: "04" },
  { month: "May", days: 31, num: "05" },
  { month: "June", days: 30, num: "06" },
  { month: "July", days: 31, num: "07" },
  { month: "August", days: 31, num: "08" },
  { month: "September", days: 30, num: "09" },
  { month: "October", days: 31, num: "10" },
  { month: "November", days: 30, num: "11" },
  { month: "December", days: 31, num: "12" },
];

const getYears = () => {
  const now = new Date();
  const year = now.getFullYear();
  const years = [];

  for (let i = year; i > year - 3; i--) {
    years.push(i);
  }

  return years;
};

enum FocusItem {
  startDate,
  endDate,
}

interface PropI {
  route: { params: { identity: string | AccountI | PropertyI } };
}

export default function ConsumptionScreen({ route }: PropI) {
  const navigator = useNavigation();
  const {
    container,
    filter,
    dateBox,
    subheading,
    wrapper,
    flexRow,
    triangle,
    dateItem,
    dateItemText,
    fText,
    itemsSet,
  } = styles;
  const { identity } = route.params;
  const [consumptionList, setConsumptionList] = useState<ConsumptionI[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [focus, setFocus] = useState<FocusItem>(FocusItem.startDate);

  const [startYear, setStartYear] = useState(0);
  const [endYear, setEndYear] = useState(0);
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");

  useEffect(() => {
    let is_subscribed = true;

    if (is_subscribed && startYear && endYear && startMonth && endMonth) {
      // setShowCalendar(!(startDate && endDate));
      fetchConsumptionList();
    }

    return () => {
      is_subscribed = false;
    };
  }, [startYear, endYear, startMonth, endMonth]);

  const fetchConsumptionList = () => {
    const start = startYear + startMonth;
    const end = endYear + endMonth;

    if (start < end) {
      const id =
        identity instanceof Account
          ? identity.CUSTKEY
          : identity instanceof Property
          ? identity.MeterNumber
          : (identity as string);
      setLoading(true);
      fetchComsumption(id, start, end)
        .then(({ status, data }) => {
          if (status === 200 && data.success) {
            const { recordset } = data.payload;
            setConsumptionList(recordset.map((item) => new Consumption(item)));
          } else {
            throw new Error(
              `Failed to retrieve consumption for ${id} in period ${start} - ${end}`
            );
          }
        })
        .catch((err) => {
          console.log(err);
          Alert.alert(
            Strings.SELF_REPORTING_PROBLEM.title,
            Strings.SELF_REPORTING_PROBLEM.message
            //   [{ onPress: () => navigator.navigate(Strings.HomeTabNavigator) }]
          );
        })
        .finally(() => setLoading(false));
    }
  };

  // FeacalSludgeMgt, tachometer-alt FA5
  const renderListItem = ({ item }: { item: ConsumptionI }) => {
    const isMeter = item[""].toLocaleLowerCase().startsWith("meter");
    const isSewer = item[""].toLocaleLowerCase().startsWith("sewer");
    return (
      <List.Item
        onPress={() => navigator.navigate(Strings.ConsumptionDetails, { item })}
        title={item[""]}
        description={
          item.DESCRIPTION ||
          `Previous Reading: ${item.PR_READING}, Current Reading: ${item.CR_READING}`
        }
        left={(props) => (
          <List.Icon
            {...props}
            icon={() => (
              <View
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 25,
                  justifyContent: "center",
                  backgroundColor: isMeter
                    ? "#00000023"
                    : isSewer
                    ? "#a25d1a23"
                    : "#1ac3ee23",
                  alignItems: "center",
                  marginLeft: 10,
                }}
              >
                {isMeter ? (
                  <SimpleLineIcons
                    name="speedometer"
                    size={23}
                    color="#030303bb"
                  />
                ) : isSewer ? (
                  <FeacalSludgeMgt width={20} height={20} fill="#a25d1a" />
                ) : (
                  <ConsumptionSVG width={20} height={20} fill="#1081e9" />
                )}
              </View>
            )}
          />
        )}
      />
    );
  };

  const startSet = !!(startYear && startMonth);
  const endSet = !!(endYear && endMonth);

  return (
    <LinearGradient
      start={[0, 0]}
      end={[1, 0]}
      colors={["#fff", "#fff"]}
      style={{ display: "flex", flex: 1 }}
    >
      <View style={container}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setShowCalendar(true);
              setFocus(FocusItem.startDate);
              setStartMonth("");
              setStartYear(0);
            }}
          >
            <View style={flexRow}>
              <View
                style={[
                  dateItem,
                  startSet
                    ? { backgroundColor: Colors.linkBlue }
                    : focus == FocusItem.startDate
                    ? {}
                    : { backgroundColor: "#bbbbbb90" },
                ]}
              >
                <Text
                  style={[
                    dateItemText,
                    startSet
                      ? itemsSet
                      : focus == FocusItem.startDate
                      ? {}
                      : fText,
                  ]}
                >
                  Start Date
                </Text>
                {startSet && (
                  <Text
                    style={[
                      dateItemText,
                      startSet
                        ? itemsSet
                        : focus == FocusItem.startDate
                        ? {}
                        : fText,
                    ]}
                  >{`01/${startMonth.replace("01", "")}/${startYear}`}</Text>
                )}
              </View>
              <View
                style={[
                  triangle,
                  startSet
                    ? { borderBottomColor: Colors.linkBlue }
                    : focus == FocusItem.startDate
                    ? {}
                    : {
                        borderBottomColor: "#bbbbbb90",
                      },
                ]}
              ></View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowCalendar(true);
              setFocus(FocusItem.endDate);
            }}
          >
            <View style={flexRow}>
              <View
                style={[
                  {
                    ...triangle,
                    transform: [{ rotate: "-90deg" }],
                    marginLeft: 0,
                    marginRight: -5,
                  },
                  endSet
                    ? { borderBottomColor: Colors.linkBlue }
                    : focus == FocusItem.endDate
                    ? {}
                    : { borderBottomColor: "#bbbbbb90" },
                ]}
              ></View>
              <View
                style={[
                  dateItem,
                  endSet
                    ? { backgroundColor: Colors.linkBlue }
                    : focus == FocusItem.endDate
                    ? {}
                    : { backgroundColor: "#bbbbbb90" },
                ]}
              >
                <Text
                  style={[
                    dateItemText,
                    endSet ? itemsSet : focus == FocusItem.endDate ? {} : fText,
                  ]}
                >
                  End Date
                </Text>
                {endSet && (
                  <Text
                    style={[
                      dateItemText,
                      focus == FocusItem.endDate ? {} : fText,
                    ]}
                  >{`31/${endMonth.replace("31", "")}/${endYear}`}</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: "white" }}>
          {loading ? (
            <ActivityIndicator
              style={{ marginTop: 20 }}
              size="large"
              color={Colors.LwscOrange}
            />
          ) : consumptionList.length ? (
            <FlatList
              removeClippedSubviews={true}
              maxToRenderPerBatch={20}
              initialNumToRender={20}
              data={consumptionList}
              keyExtractor={() => uuid()}
              renderItem={renderListItem}
            />
          ) : (
            <Text style={{ margin: 15 }}>
              There is no consumption information for the specified time period
            </Text>
          )}
        </View>
        <Provider>
          <Portal>
            <Modal
              contentContainerStyle={{
                // flex: 1,
                height: 100,
              }}
              visible={showCalendar}
              onDismiss={() => setShowCalendar(false)}
            >
              <View
                style={{
                  justifyContent: "flex-start",
                  flex: 1,
                  paddingHorizontal: 15
                }}
              >
                <View style={{ backgroundColor: "#fff" }}>
                  <Picker
                    selectedValue={
                      focus == FocusItem.startDate ? startYear : endYear
                    }
                    onValueChange={(itemValue, itemIndex) => {
                      if (focus == FocusItem.startDate) {
                        setStartYear(itemValue);
                        if (itemValue && startMonth) {
                          setShowCalendar(false);
                          setFocus(FocusItem.endDate);
                        }
                      } else {
                        setEndYear(itemValue);
                        if (itemValue && endMonth) {
                          setShowCalendar(false);
                        }
                      }
                    }}
                  >
                    <Picker.Item key={0} value={0} label="Select Year" />
                    {getYears().map((year) => (
                      <Picker.Item
                        key={year}
                        value={year}
                        label={year.toString()}
                      />
                    ))}
                  </Picker>
                  <Divider />
                </View>
                <View style={{ backgroundColor: "#fff" }}>
                  <Picker
                    selectedValue={
                      focus == FocusItem.startDate ? startMonth : endMonth
                    }
                    onValueChange={(itemValue, itemIndex) => {
                      if (focus == FocusItem.startDate) {
                        setStartMonth(itemValue);
                        if (startYear && itemValue) {
                          setShowCalendar(false);
                          setFocus(FocusItem.endDate);
                        }
                      } else {
                        setEndMonth(itemValue);
                        if (endYear && itemValue) {
                          setShowCalendar(false);
                        }
                      }
                    }}
                  >
                    <Picker.Item key="" value="" label="Select Month" />
                    {months.map(({ month, days, num }) => (
                      <Picker.Item
                        key={month}
                        value={`${num}${
                          focus == FocusItem.startDate ? "01" : days
                        }`}
                        label={month}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </Modal>
          </Portal>
        </Provider>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    ...StyleSheet.absoluteFillObject,
  },
  wrapper: {
    flexDirection: "row",
    display: "flex",
  },
  filter: {
    display: "flex",
    backgroundColor: `#1ac3ee23`,
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  dateBox: {
    display: "flex",
  },
  btnLabelStyle: {
    color: Colors.LwscSelectedBlue,
  },
  subheading: {
    paddingLeft: 5,
    color: Colors.LwscBlue,
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 35,
    borderRightWidth: 35,
    borderBottomWidth: 60,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: `${Colors.LwscBlue}`,
    transform: [{ rotate: "90deg" }],
    margin: 0,
    marginLeft: -5,
    borderWidth: 0,
    borderColor: "transparent",
  },
  dateItem: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.LwscBlue,
    paddingHorizontal: 20,
    // flex: 1,
  },
  dateItemText: {
    color: "white",
    fontSize: 13,
    fontWeight: "700",
  },
  fText: {
    marginTop: 5,
    color: Colors.LwscBlue,
  },
  itemsSet: {
    color: "#fff",
  },
});
