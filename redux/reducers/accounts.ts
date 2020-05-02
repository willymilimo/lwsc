import { AccountI } from "../../models/account";
import Actions, { ActionI } from "../Actions";
import { AsyncStorage } from "react-native";
import Strings from "../../constants/Strings";

export interface AccountReducerI {
  [key: string]: AccountI;
}

const initState: AccountReducerI = {};

export default function (
  state = initState,
  action: ActionI<AccountReducerI | AccountI | string>
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
    case Actions.DELETE_ACCOUNT:
      payload = payload as string;
      delete state[payload];
      break;
  }

  if (
    [
      Actions.SET_ACCOUNTS,
      Actions.ADD_ACCOUNT,
      Actions.DELETE_ACCOUNT,
    ].includes(type)
  ) {
    AsyncStorage.setItem(Strings.ACCOUNTS_STORAGE, JSON.stringify(state));
  }

  return state;
}
