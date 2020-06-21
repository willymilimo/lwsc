import Actions, { ActionI } from "../Actions";
import Strings from "../../constants/Strings";
import { AsyncStorage } from "react-native";
import { PayPointReducer } from "../../types/paypoint";
import { PayPointI } from "../../models/pay-point";

const sds = [
  {
    name: "CHELSTON OFFICE",
    latitude: -15.37496,
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

const initState: PayPointReducer = {
  "Makeni Area": [],
  "Munali Area": [
    {
      name: "CHELSTON OFFICE",
      latitude: -15.37496,
      longitude: 28.382121,
    },
  ],
  "Central Business District": [
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
  ],
  "Matero Area": [],
  "Chilenje Area": [],
};

export default function (
  state = initState,
  action: ActionI<{ [region: string]: PayPointI[] } | PayPointReducer>
) : PayPointReducer {
  const { type, payload } = action;

  switch (type) {
    case Actions.SET_PAY_POINTS:
      state = payload as PayPointReducer;
      break;

    case Actions.ADD_PAYPOINT:
      const item = payload as { [region: string]: PayPointI[] };
      state = { ...state, ...item };
      break;
  }

  if (payload) {
    AsyncStorage.setItem(Strings.PAYPOINTS_STORAGE, JSON.stringify(state));
  }

  return state;
}
