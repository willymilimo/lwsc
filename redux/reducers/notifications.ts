import { NotificationI } from "../../models/notification";
import Actions, { ActionI } from "../Actions";
import { AsyncStorage } from "react-native";
import Strings from "../../constants/Strings";

const initState: NotificationI[] = [];

export default function (state = initState, action: ActionI) {
  const { type, payload } = action;

  switch (type) {
    case Actions.SET_NOTIFICATIONS:
      state = payload;
      break;

    case Actions.ADD_NOTIFICATIONS:
      state = [...state, payload];
      break;
  }

  if (payload) {
    AsyncStorage.setItem(Strings.NOTIFICATIONS_STORAGE, JSON.stringify(state));
  }

  return state;
}
