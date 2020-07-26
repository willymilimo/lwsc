import Actions, { ActionI } from "../Actions";
import { AsyncStorage } from "react-native";
import Strings from "../../constants/Strings";
import { BookNumberI } from "../../models/meter-reading";

export interface BookNumberReducerI {
  [key: string]: { [key: string]: BookNumberI };
}

const initState: BookNumberReducerI = {};

export default function (
  state = initState,
  action: ActionI<BookNumberReducerI | BookNumberI | string>
): BookNumberReducerI {
  let { type, payload } = action;

  switch (type) {
    case Actions.SET_BOOK_NUMBER:
      state = payload as BookNumberReducerI;
      break;
    case Actions.ADD_BOOK_NUMBER:
      payload = payload as BookNumberI;
      const item = state[payload.key];
      state = { ...state, [payload.key]: { ...item, payload } };
      break;
    case Actions.DELETE_BOOK_NUMBER:
      payload = payload as string;
      delete state[payload];
      break;
  }

  if (
    [
      Actions.SET_BOOK_NUMBER,
      Actions.ADD_BOOK_NUMBER,
      Actions.DELETE_BOOK_NUMBER,
    ].includes(type)
  ) {
    AsyncStorage.setItem(Strings.BOOK_NUMBER_STORAGE, JSON.stringify(state));
  }

  return state;
}
