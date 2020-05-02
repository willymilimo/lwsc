import { NavigationProp, NavigationState } from "@react-navigation/native";

export type NavType = NavigationProp<
  Record<string, object | undefined>,
  string,
  NavigationState,
  {},
  {}
>;
