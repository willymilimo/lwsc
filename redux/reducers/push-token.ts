import Actions, { ActionI } from "../Actions";
import Strings from "../../constants/Strings";
import { AsyncStorage } from "react-native";

const initState = "";

export default function (state = initState, action: ActionI<string>): string {
  switch (action.type) {
    case Actions.SET_PUSH_TOKEN_SUBMITTED:
      state = action.payload;
      break;
  }

  if ([Actions.SET_PUSH_TOKEN_SUBMITTED].includes(action.type)) {
    console.log(`storing token: ${state}`)
    AsyncStorage.setItem(Strings.PUSH_TOKEN_STORAGE, state);
  }

  return state;
}
