import Actions, { ActionI } from "../Actions";
import { AsyncStorage } from "react-native";
import Strings from "../../constants/Strings";

const initState: Date = new Date();

export default function (state = initState, action: ActionI<Date>): Date {
  switch (action.type) {
    case Actions.SET_LOAD_TIME:
      state = action.payload;
      break;
  }

  if (action.type === Actions.SET_LOAD_TIME) {
    AsyncStorage.setItem(Strings.LOAD_TIME_STORAGE, state.toString());
  }

  return state;
}
