import React from "react";
import { Text, View, Modal, StyleSheet } from "react-native";
import PropTypes from "prop-types";

interface ToastI {
  visible: boolean;
  message: string;
  center?: boolean;
}

type ToastT = ToastI;

function Toast({ visible, message, center }: ToastT) {
  const { container, text, centerText } = styles;

  return (
    <Modal transparent visible={visible}>
      <View style={container}>
        <Text style={center ? [text, centerText] : text}>{message}</Text>
      </View>
    </Modal>
  );
}

Toast.propTypes = {
  visible: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  center: PropTypes.bool
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff99",
    display: "flex",
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30
  },
  text: {
    backgroundColor: "#fff",
    padding: 20
  },
  centerText: {
    textAlign: "center"
  }
});

export default Toast;
