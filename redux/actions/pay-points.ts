import { PayPointI } from "../../models/pay-point";
import Actions, { ActionI } from "../Actions";

export const setPayPoints = (paypoints: PayPointI[]): ActionI<any> => ({
  type: Actions.SET_PAY_POINTS,
  payload: paypoints,
});

export const addPayPoints = (paypoint: PayPointI): ActionI<any> => ({
  type: Actions.ADD_PAYPOINT,
  payload: paypoint,
});
