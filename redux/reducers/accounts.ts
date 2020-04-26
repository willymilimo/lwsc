import { AccountI } from "../../models/account";
import Actions, { ActionI } from "../Actions";
import { AsyncStorage } from "react-native";
import Strings from "../../constants/Strings";

const initState: AccountI[] = [];

export default function (state = initState, action: ActionI): AccountI[] {
  const { type, payload } = action;

  switch (type) {
    case Actions.ADD_ACCOUNT:
      state = [...state, payload];
      break;
    case Actions.DELETE_ACCOUNT:
      state = state.filter(
        (acct) => acct.ACCOUNT_NO !== payload && acct.METER_NO !== payload
      );
      break;
  }

  if (payload) {
    AsyncStorage.setItem(Strings.ACCOUNTS_STORAGE, JSON.stringify(initState));
  }

  return state;
}
