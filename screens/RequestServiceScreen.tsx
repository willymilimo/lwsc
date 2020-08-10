import React, { useState } from "react";
import { StyleSheet, Image, View, Alert, Platform, Text } from "react-native";
import {
  ServiceApplicationI,
  ServiceApplication,
} from "../models/service-application";
import { applyForService, reportLeakage, api_root } from "../models/axios";
import Strings from "../constants/Strings";
import { useNavigation } from "@react-navigation/native";
import {
  BookNumberI,
  PropertyI,
  BillGroupI,
  Property,
} from "../models/meter-reading";
import { connect } from "react-redux";
import { RootReducerI } from "../redux/reducers";
import { ServiceItemI } from "../models/service-item";
import { Subheading, Button } from "react-native-paper";
import { MeterItem } from "./ReadMeterScreen";
import Colors from "../constants/Colors";
import { ServiceReportI, ServiceReport } from "../models/service-report";
import { encode as btoa } from "base-64";
import {
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { UserReducerI } from "../redux/reducers/user";

const myHeaders = new Headers();
myHeaders.append(
  "Authorization",
  "Basic bHdzY19tb2JpbGVfYXBwX2Rldjojd3d3QDEyMzRfbHdzY19hcHA="
);

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  // redirect: 'follow'
};

interface PropI {
  user: UserReducerI;
  services: ServiceItemI[];
  route: {
    params: {
      item: ServiceApplicationI | ServiceReportI | PropertyI;
      bookNumber: BookNumberI;
      billGroup: BillGroupI;
    };
  };
}

const RequestServiceScreen = ({ user, services, route }: PropI) => {
  const { billGroup, bookNumber, item } = route.params;
  const { container, flexRow, heading, value } = styles;
  const navigator = useNavigation();
  const [loading, setLoading] = useState(false);

  const flexRowItem = (header: string, content: string | number) => {
    return (
      <View style={flexRow}>
        <Subheading style={heading}>{header}</Subheading>
        <Subheading style={value}>{content}</Subheading>
      </View>
    );
  };

  const serviceReportRequest = (report: ServiceReportI) => {
    setLoading(true);

    reportLeakage(report)
      .then(({ status, data }) => {
        // console.log(data)
        const { success, payload } = data;
        if (status === 200 && success) {
          Alert.alert(
            Strings.REPORT_SUCCESS.title,
            Strings.REPORT_SUCCESS.message,
            [
              {
                onPress: () => navigator.navigate(Strings.HomeTabNavigator),
              },
            ]
          );
        }
      })
      .catch((err) =>
        Alert.alert(
          Strings.SELF_REPORTING_PROBLEM.title,
          Strings.SELF_REPORTING_PROBLEM.message,
          [
            {
              onPress: () => navigator.navigate(Strings.HomeTabNavigator),
            },
          ]
        )
      )
      .finally(() => setLoading(false));
  };

  const ServiceApplicationRequest = (service: ServiceApplicationI) => {
    applyForService(service)
      .then(({ status, data }) => {
        const { success, payload } = data;
        if (status === 200 && success) {
          console.log(payload);
          Alert.alert(
            "Request Submitted",
            "Service request submitted successfully. We will respond to you on your provided contact details.",
            [{ onPress: () => navigator.navigate(Strings.HomeTabNavigator) }]
          );
        } else {
          Alert.alert(
            Strings.SELF_REPORTING_PROBLEM.title,
            Strings.SELF_REPORTING_PROBLEM.message,
            [{ onPress: () => navigator.navigate(Strings.HomeTabNavigator) }]
          );
        }
      })
      .catch((err) => {
        // console.log(err);
        Alert.alert(
          Strings.SELF_REPORTING_PROBLEM.title,
          Strings.SELF_REPORTING_PROBLEM.message,
          [{ onPress: () => navigator.navigate(Strings.HomeTabNavigator) }]
        );
      })
      .finally(() => setLoading(false));
  };

  const requestService = () => {
    setLoading(true);

    if (item instanceof ServiceReport) {
      const service = {
        ...item,
        bill_group: bookNumber.BILLGROUP,
        area: bookNumber.DESCRIBE,
      };
      serviceReportRequest(service);
    } else {
      const service = {
        ...(item as ServiceApplicationI),
        bill_group: bookNumber.BILLGROUP,
      };
      ServiceApplicationRequest(service);
    }
  };
  // console.log(`${api_root}${application.files[0].remote_location}`)
  // console.log(item)
  return (
    <View style={container}>
      {item instanceof ServiceReport || item instanceof ServiceApplication ? (
        <>
          {item instanceof ServiceApplication &&
            flexRowItem(
              "Service Type",
              services.filter((s) => s._id === (item as any).service_type)[0]
                .title
            )}
          {flexRowItem("Name", `${item.first_name} ${item.last_name}`)}
          {flexRowItem("Phone #", item.phone)}
          {!!item.email && flexRowItem("Email", item.email)}
          {!!item.address && flexRowItem("Address", item.address)}
          {flexRowItem("Area", bookNumber.DESCRIBE)}
          {!!item.description && flexRowItem("Description", item.description)}
          {!!item.meter_number && flexRowItem("Account #", item.meter_number)}
        </>
      ) : item instanceof Property ? (
        <View>
          {user && (
            <MeterItem
              icon={
                <Ionicons name="ios-person" size={25} color={Colors.linkBlue} />
              }
              title="Man Number"
              value={user.manNumber}
            />
          )}
          <MeterItem
            icon={
              <MaterialCommunityIcons
                size={20}
                color={Colors.linkBlue}
                name="home-group"
              />
            }
            title="Area (Book Number)"
            value={`${bookNumber.CODE} - ${bookNumber.DESCRIBE}`}
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
            value={`${item.AccountNumber}-${item.MeterNumber}`}
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
            value={`${item.PLOT_NO} ${item.Customer_Address}`}
          />
          <MeterItem
            icon={<Entypo name="location" size={20} color={Colors.linkBlue} />}
            title="Township"
            value={item.Township}
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
            value={item.previousReadingDate.toDateString()}
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
            value={item.PreviousReading}
          />
        </View>
      ) : (
        <></>
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
        disabled={loading}
        loading={loading}
        //   icon="send"
        mode="outlined"
        onPress={requestService}
      >
        SUMBIT
      </Button>
    </View>
  );
};

const mapPropsToState = ({ services, user }: RootReducerI) => ({
  services,
  user,
});

export default connect(mapPropsToState)(RequestServiceScreen);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
    padding: 20,
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 15,
    width: 120,
  },
  value: {
    fontSize: 14,
  },
});
