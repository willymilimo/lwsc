import React, { Component } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";

export class SignInScreen extends Component {
  static navigationOptions = {
    title: "Customers",
  };

  render() {
    return (
      <View>
        <Text> Customers </Text>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen);
