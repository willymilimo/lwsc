import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { ConsumptionI, Consumption } from "../models/consumption";
import { PropertyI, Property } from "../models/meter-reading";
import { AccountI, Account } from "../models/account";
import { fetchComsumption } from "../models/axios";
import {
  Button,
  Subheading,
  ActivityIndicator,
  List,
} from "react-native-paper";
import { Calendar } from "react-native-calendars";
import Colors from "../constants/Colors";
import { formatDate, uuid } from "../helpers/functions";
import { FlatList } from "react-native-gesture-handler";
import ConsumptionSVG from "../assets/consumption.svg";
import FeacalSludgeMgt from "../assets/feacal_sludge_mgt.svg";
import Strings from "../constants/Strings";
import { useNavigation } from "@react-navigation/native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

enum FocusItem {
  startDate,
  endDate,
}

interface PropI {
  route: { params: { identity: string | AccountI | PropertyI } };
}

export default function ConsumptionScreen({ route }: PropI) {
  const navigator = useNavigation();
  const { container, filter, dateBox, subheading, wrapper, triangle } = styles;
  const { identity } = route.params;
  const [consumptionList, setConsumptionList] = useState<ConsumptionI[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);
  const [focus, setFocus] = useState<FocusItem>(FocusItem.startDate);

  useEffect(() => {
    let is_subscribed = true;

    if (is_subscribed && startDate.length && endDate.length) {
      setShowCalendar(!(startDate && endDate));
      fetchConsumptionList();
    }

    return () => {
      is_subscribed = false;
    };
  }, [startDate, endDate]);

  const fetchConsumptionList = () => {
    const start = startDate.replace(/-/g, "");
    const end = endDate.replace(/-/g, "");
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

  return (
    <LinearGradient
      start={[0, 0]}
      end={[1, 0]}
      colors={["#56cbf1", "#5a86e4"]}
      style={{ display: "flex", flex: 1 }}
    >
      <View style={container}>
        <View style={wrapper}>
          <View style={triangle}></View>
        </View>
        {/* <View style={filter}>
          <View style={dateBox}>
            {!!(startDate && endDate) && (
              <Subheading style={subheading}>Start Date</Subheading>
            )}
            <Button
              color={Colors.LwscSelectedBlue}
              mode="outlined"
              onPress={() => {
                setFocus(FocusItem.startDate);
                setShowCalendar(true);
              }}
            >
              {startDate || "Start Date"}
            </Button>
          </View>
          <View style={{ ...dateBox, opacity: startDate ? 1 : 0 }}>
            {!!(startDate && endDate) && (
              <Subheading style={subheading}>End Date</Subheading>
            )}
            <Button
              color={Colors.LwscSelectedBlue}
              mode="outlined"
              onPress={() => {
                setFocus(FocusItem.endDate);
                setShowCalendar(true);
              }}
            >
              {endDate || "End Date"}
            </Button>
          </View>
          <View style={{ ...dateBox, justifyContent: "flex-end" }}>
            <Button
              color={Colors.danger.color}
              style={{
                alignSelf: "baseline",
                backgroundColor: `${Colors.danger.background}77`,
                borderColor: Colors.danger.border,
              }}
              labelStyle={{ color: Colors.danger.color }}
              mode="outlined"
              onPress={() => {
                setStartDate("");
                setEndDate("");
                setConsumptionList([]);
              }}
            >
              Clear
            </Button>
          </View>
        </View> */}
        {showCalendar ? (
          <Calendar
            maxDate={formatDate(new Date())}
            onDayPress={(day) => {
              if (focus === FocusItem.startDate) {
                setStartDate(day.dateString);
              } else if (new Date(startDate) < new Date(day.dateString)) {
                setEndDate(day.dateString);
              }
            }}
          />
        ) : loading ? (
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    ...StyleSheet.absoluteFillObject,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
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
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 35,
    borderRightWidth: 35,
    borderBottomWidth: 60,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor:"yellow",
    transform: [
        { rotate: '90deg' }
    ],
    margin: 0,
    marginLeft: -6,
    borderWidth: 0,
    borderColor:"transparent"
}
});
