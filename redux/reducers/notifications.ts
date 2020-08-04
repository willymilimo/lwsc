import { NotificationI } from "../../models/notification";
import Actions, { ActionI } from "../Actions";
import { AsyncStorage } from "react-native";
import Strings from "../../constants/Strings";

const initState: NotificationI[] = [];

export default function (state = initState, action: ActionI<any>) {
  let { type, payload } = action;

  switch (type) {
    case Actions.SET_NOTIFICATIONS:
      state = payload;
      break;

    case Actions.ADD_NOTIFICATIONS:
      payload = payload as NotificationI;
      if (!state.some((item) => item._id === payload._id)) {
        state = [payload, ...state];
      }
      break;

    case Actions.SET_NOTIFICATION_READ:
      state = state.map((item) => {
        if (item._id == payload) item.is_read = true;
        return item;
      });
      break;
  }

  if (
    [
      Actions.SET_NOTIFICATIONS,
      Actions.ADD_NOTIFICATIONS,
      Actions.SET_NOTIFICATION_READ,
    ].includes(type)
  ) {
    AsyncStorage.setItem(Strings.NOTIFICATIONS_STORAGE, JSON.stringify(state));
  }

  return state;
}
