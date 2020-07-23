import Actions, { ActionI } from "../Actions";
import { AsyncStorage } from "react-native";
import Strings from "../../constants/Strings";
import { BillGroupI } from "../../models/meter-reading";

export interface BillGroupReducerI {
  [key: string]: BillGroupI;
}

const initState: BillGroupReducerI = {};

export default function (
  state = initState,
  action: ActionI<BillGroupReducerI | BillGroupI | string>
): BillGroupReducerI {
  let { type, payload } = action;

  switch (type) {
    case Actions.SET_BILL_GROUP:
      state = payload as BillGroupReducerI;
      break;
    case Actions.ADD_BILL_GROUP:
      payload = payload as BillGroupI;
      state = { ...state, [payload.GROUP_ID]: payload };
      break;
    case Actions.DELETE_BILL_GROUP:
      payload = payload as string;
      delete state[payload];
      break;
  }

  if (
    [
      Actions.SET_BILL_GROUP,
      Actions.ADD_BILL_GROUP,
      Actions.DELETE_BILL_GROUP,
    ].includes(type)
  ) {
    AsyncStorage.setItem(Strings.BILL_GROUP_STORAGE, JSON.stringify(state));
  }

  return state;
}
