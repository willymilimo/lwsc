import Actions, { ActionI } from "../Actions";
import { StatementI } from "../../models/statement";

export const setPaymentHistory = (
  paymentHistory: StatementI[]
): ActionI<any> => ({
  type: Actions.SET_PAYMENT_HISTORY,
  payload: paymentHistory,
});

export const addPaymentHistory = (
  paymentHistory: StatementI
): ActionI<any> => ({
  type: Actions.ADD_PAYMENT_HISTORY,
  payload: paymentHistory,
});
