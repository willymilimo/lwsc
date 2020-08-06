import React, { useState } from "react";
import { StyleSheet, Image, View, Alert } from "react-native";
import { ServiceApplicationI } from "../models/service-application";
import { applyForService, reportLeakage, api_root } from "../models/axios";
import Strings from "../constants/Strings";
import { useNavigation } from "@react-navigation/native";
import { BookNumberI } from "../models/meter-reading";
import { connect } from "react-redux";
import { RootReducerI } from "../redux/reducers";
import { ServiceItemI } from "../models/service-item";
import { Subheading, Button } from "react-native-paper";
import Colors from "../constants/Colors";
import { ServiceReportI, ServiceReport } from "../models/service-report";
import { encode as btoa } from "base-64";

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
  services: ServiceItemI[];
  route: {
    params: {
      application: ServiceApplicationI | ServiceReportI;
      bookNumber: BookNumberI;
    };
  };
}

const RequestServiceScreen = ({ services, route }: PropI) => {
  const {
    first_name,
    last_name,
    phone,
    email,
    address,
    description,
    meter_number,
  } = route.params.application;
  const { bookNumber, application } = route.params;
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

    if (application instanceof ServiceReport) {
      const service = {
        ...application,
        bill_group: bookNumber.BILLGROUP,
        area: bookNumber.DESCRIBE,
      };
      serviceReportRequest(service);
    } else {
      const service = {
        ...(application as ServiceApplicationI),
        bill_group: bookNumber.BILLGROUP,
      };
      ServiceApplicationRequest(service);
    }
  };
  // console.log(`${api_root}${application.files[0].remote_location}`)
  return (
    <View style={container}>
      {application instanceof ServiceReport ? (
        <>
          {flexRowItem("Name", `${first_name} ${last_name}`)}
          {flexRowItem("Phone #", phone)}
          {!!email && flexRowItem("Email", email)}
          {!!address && flexRowItem("Address", address)}
          {flexRowItem("Area", bookNumber.DESCRIBE)}
          {!!description && flexRowItem("Description", description)}
          {!!meter_number && flexRowItem("Account #", meter_number)}
        </>
      ) : (
        <>
          {flexRowItem(
            "Service Type",
            services.filter(
              (s) => s._id === (application as any).service_type
            )[0].title
          )}
          {flexRowItem("Name", `${first_name} ${last_name}`)}
          {flexRowItem("Phone #", phone)}
          {!!email && flexRowItem("Email", email)}
          {!!address && flexRowItem("Address", address)}
          {flexRowItem("Area", bookNumber.DESCRIBE)}
          {!!description && flexRowItem("Description", description)}
          {!!meter_number && flexRowItem("Account #", meter_number)}
        </>
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

const mapPropsToState = ({ services }: RootReducerI) => ({ services });

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
