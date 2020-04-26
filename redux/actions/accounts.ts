import { AccountI } from "../../models/account";
import Actions, { ActionI } from "../Actions";

export const addAccount = (account: AccountI): ActionI => ({
  type: Actions.ADD_ACCOUNT,
  payload: account,
});

export const deleteAccount = (meter_account_no: string | number): ActionI => ({
  type: Actions.DELETE_ACCOUNT,
  payload: meter_account_no,
});
