import Actions, { ActionI } from "../Actions";
import { PaymentHistoryI } from "../../models/payment-history";

export const setPaymentHistory = (
  paymentHistory: PaymentHistoryI[]
): ActionI<any> => ({
  type: Actions.SET_PAYMENT_HISTORY,
  payload: paymentHistory,
});

export const addPaymentHistory = (
  paymentHistory: PaymentHistoryI
): ActionI<any> => ({
  type: Actions.ADD_PAYMENT_HISTORY,
  payload: paymentHistory,
});
