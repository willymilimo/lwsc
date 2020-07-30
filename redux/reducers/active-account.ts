import Actions, { ActionI } from "../Actions";
import { AsyncStorage } from "react-native";
import Strings from "../../constants/Strings";
import { AddType } from "../../types/add-type";

export interface ActiveAccountReducerI {
  [account: string]: AddType;
}

const initState: ActiveAccountReducerI = {};

export default function (
  state = initState,
  action: ActionI<ActiveAccountReducerI | string>
): ActiveAccountReducerI {
  let { type, payload } = action;

  switch (type) {
    case Actions.SET_ACTIVE_ACCOUNTS:
      state = payload as ActiveAccountReducerI;
      break;

    case Actions.UNSET_ACTIVE_ACCOUNT:
      state = {};
      break;
  }

  if (
    [Actions.SET_ACTIVE_ACCOUNTS, Actions.UNSET_ACTIVE_ACCOUNT].includes(type)
  ) {
    AsyncStorage.setItem(Strings.ACTIVE_ACCOUNT_STORAGE, JSON.stringify(state));
  }

  return state;
}
