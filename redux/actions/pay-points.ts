import { PayPointI, PaypointI } from "../../models/pay-point";
import Actions, { ActionI } from "../Actions";

export const setPayPoints = (paypoints: PaypointI[]): ActionI<PaypointI[]> => ({
  type: Actions.SET_PAY_POINTS,
  payload: paypoints,
});

export const addPayPoints = (paypoint: {
  [region: string]: PaypointI[];
}): ActionI<any> => ({
  type: Actions.ADD_PAYPOINT,
  payload: paypoint,
});
