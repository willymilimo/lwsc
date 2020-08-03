import Actions, { ActionI } from "../Actions";
import Strings from "../../constants/Strings";
import { AsyncStorage } from "react-native";
import { PaypointI } from "../../models/pay-point";

const initState: PaypointI[] = [];

export default function (
  state = initState,
  action: ActionI<PaypointI[]>
): PaypointI[] {
  const { type, payload } = action;

  switch (type) {
    case Actions.SET_PAY_POINTS:
      state = payload as PaypointI[];
      break;

    // case Actions.ADD_PAYPOINT:
    //   const item = payload as { [region: string]: PayPointI[] };
    //   state = { ...state, ...item };
    //   break;
  }

  if (type === Actions.SET_PAY_POINTS) {
    // console.log(type, state)
    AsyncStorage.setItem(Strings.PAYPOINTS_STORAGE, JSON.stringify(state));
  }

  return state;
}
