import Actions, { ActionI } from "../Actions";
import Strings from "../../constants/Strings";
import { AsyncStorage } from "react-native";

const initState = false;

export default function (state = initState, action: ActionI<boolean>): boolean {
  switch (action.type) {
    case Actions.SET_PUSH_TOKEN_SUBMITTED:
      state = action.payload;
      break;
  }

  if ([Actions.SET_PUSH_TOKEN_SUBMITTED].includes(action.type)) {
    AsyncStorage.setItem(Strings.PUSH_TOKEN_STORAGE, JSON.stringify(state));
  }

  return state;
}
