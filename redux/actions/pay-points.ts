import { PayPointI } from "../../models/pay-point";
import Actions, { ActionI } from "../Actions";
import { PayPointReducer } from "../../types/paypoint";

export const setPayPoints = (paypoints: PayPointReducer): ActionI<any> => ({
  type: Actions.SET_PAY_POINTS,
  payload: paypoints,
});

export const addPayPoints = (paypoint: {
  [region: string]: PayPointI[];
}): ActionI<any> => ({
  type: Actions.ADD_PAYPOINT,
  payload: paypoint,
});
