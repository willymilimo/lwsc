import Actions, { ActionI } from "../Actions";
import { ServiceItemI } from "../../models/service-item";

const initState: ServiceItemI[] = [];

export default function (
  state = initState,
  action: ActionI<ServiceItemI[]>
): ServiceItemI[] {
  switch (action.type) {
    case Actions.SET_SERVICE_TYPES:
      return action.payload;
  }

  return state;
}
