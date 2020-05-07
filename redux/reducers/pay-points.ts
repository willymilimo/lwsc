import Actions, { ActionI } from "../Actions";
import Strings from "../../constants/Strings";
import { AsyncStorage } from "react-native";

const initState = [
  {
    name: "CHELSTON OFFICE",
    latitute: -15.37496,
    longitude: 28.382121,
  },
  {
    name: "HEAD OFFICE",
    latitude: -15.412123,
    longitude: 28.303703,
  },
  {
    name: "LUMUMBA BRANCH",
    latitude: -15.415724,
    longitude: 28.282466,
  },
];

export default function (state = initState, action: ActionI<any>) {
  const { type, payload } = action;

  switch (type) {
    case Actions.SET_PAY_POINTS:
      state = payload;
      break;

    case Actions.ADD_PAYPOINT:
      state = [...state, payload];
      break;
  }

  if (payload) {
    AsyncStorage.setItem(Strings.PAYPOINTS_STORAGE, JSON.stringify(state));
  }

  return state;
}
