import Actions, { ActionI } from "../Actions";
import { ServiceItemI } from "../../models/service-item";

export const setServiceTypes = (
  serviceTypes: ServiceItemI[]
): ActionI<ServiceItemI[]> => ({
  type: Actions.SET_SERVICE_TYPES,
  payload: serviceTypes,
});
