import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ConsumptionI } from "../models/consumption";
import { connect } from "react-redux";
import { RootReducerI } from "../redux/reducers";
import { PropertyI } from "../models/meter-reading";
import { AccountI } from "../models/account";
import { fetchComsumption } from "../models/axios";
import { Button, Subheading } from "react-native-paper";

interface PropI {
  route: { params: { identity: string | AccountI | PropertyI } };
}

export default function ConsumptionScreen({ route }: PropI) {
  const { container, filter, dateBox } = styles;
  const { identity } = route.params;
  const [consumptionList, setConsumptionList] = useState<ConsumptionI[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    let is_subscribed = true;

    if (is_subscribed) {
    }

    return () => {
      is_subscribed = false;
    };
  }, [identity]);

  const fetchConsumptionList = () => {
    //   fetchComsumption()
  };

  return (
    <View style={container}>
      <View style={filter}>
        <View style={dateBox}>
          {!!(startDate && endDate) && <Subheading>Start Date</Subheading>}
          <Button mode="outlined" onPress={() => {}}>
            Start Date
          </Button>
        </View>
        <View style={dateBox}>
          {!!(startDate && endDate) && <Subheading>End Date</Subheading>}
          <Button mode="outlined" onPress={() => {}}>
            End Date
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
  },
  filter: {
    display: "flex",
    backgroundColor: `#1ac3ee23`,
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 25,
    justifyContent: "space-between",
  },
  dateBox: {
    display: "flex",
  },
});
