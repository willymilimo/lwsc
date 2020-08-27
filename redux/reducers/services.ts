import Actions, { ActionI } from "../Actions";
import { ServiceItemI } from "../../models/service-item";
import { AsyncStorage } from "react-native";
import Strings from "../../constants/Strings";

const initState: ServiceItemI[] = [];

export default function (
  state = initState,
  action: ActionI<ServiceItemI[]>
): ServiceItemI[] {
  switch (action.type) {
    case Actions.SET_SERVICE_TYPES:
      state = action.payload;
      break;
  }

  if (action.type === Actions.SET_SERVICE_TYPES) {
    AsyncStorage.setItem(Strings.SERVICES_STORAGE, JSON.stringify(state));
  }

  return state;
}
