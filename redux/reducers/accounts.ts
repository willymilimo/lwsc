import { AccountI } from "../../models/account";
import Actions, { ActionI } from "../Actions";
import { AsyncStorage } from "react-native";
import Strings from "../../constants/Strings";
import { PropertyI } from "../../models/meter-reading";

export interface AccountReducerI {
  [key: string]: AccountI | PropertyI | string;
}

const initState: AccountReducerI = {};

export default function (
  state = initState,
  action: ActionI<AccountReducerI | AccountI | PropertyI | string>
): AccountReducerI {
  let { type, payload } = action;

  switch (type) {
    case Actions.SET_ACCOUNTS:
      state = payload as AccountReducerI;
      break;
    case Actions.ADD_ACCOUNT:
      payload = payload as AccountI;
      state = { ...state, [payload.CUSTKEY]: payload };
      break;
    case Actions.ADD_ACCUNT_PROPERTY:
      payload = payload as PropertyI;
      state = { ...state, [payload.MeterNumber]: payload };
      break;
    case Actions.ADD_METER_NUMBER:
      payload = payload as string;
      state = { ...state, [payload]: payload };
      break;
    case Actions.DELETE_ACCOUNT:
      payload = payload as string;
      const result: any = {};
      Object.keys(state).forEach((key) => {
        if (key !== payload) {
          result[key] = state[key];
        }
      });

      state = result;
      break;
  }

  if (
    [
      Actions.SET_ACCOUNTS,
      Actions.ADD_ACCOUNT,
      Actions.DELETE_ACCOUNT,
      Actions.ADD_ACCUNT_PROPERTY,
      Actions.ADD_METER_NUMBER,
    ].includes(type)
  ) {
    AsyncStorage.setItem(Strings.ACCOUNTS_STORAGE, JSON.stringify(state));
  }

  return state;
}
