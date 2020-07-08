import { Dimensions, Platform } from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

// console.log(width);

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  screenConfig: Platform.select({
    web: { headerMode: "screen" },
    default: {},
  }),
};
