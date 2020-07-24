import Actions, { ActionI } from "../Actions";
import { BillGroupI } from "../../models/meter-reading";
import { BillGroupReducerI } from "../reducers/bill-groups";

export const setBillGroups = (
  billGroups: BillGroupReducerI
): ActionI<BillGroupReducerI> => ({
  type: Actions.SET_BILL_GROUP,
  payload: billGroups,
});

export const addBillGroup = (account: BillGroupI): ActionI<BillGroupI> => ({
  type: Actions.ADD_BILL_GROUP,
  payload: account,
});

export const deleteBillGroup = (key: string): ActionI<string> => ({
  type: Actions.DELETE_BILL_GROUP,
  payload: key,
});
