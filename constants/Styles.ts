import Colors from "./Colors";
import Strings from "./Strings";

export default {
  [Strings.BLUE_THEME]: {
    appBarColor: Colors.colorBlueLink,
    textColor: Colors.whiteColor,
    backgroundColor: Colors.LwscBlue,
    activeTintColor: Colors.LwscOrange,
    inactiveTintColor: Colors.whiteColor,
  },
  [Strings.WHITE_THEME]: {
    appBarColor: "transparent",
    textColor: Colors.LwscBlackLighter,
    backgroundColor: Colors.whiteColor,
    activeTintColor: `${Colors.LwscBlue}`,
    inactiveTintColor: `${Colors.LwscBlue}88`,
  },
};
