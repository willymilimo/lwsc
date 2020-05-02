import { AccountI } from "../../models/account";
import Actions, { ActionI } from "../Actions";
import { AccountReducerI } from "../reducers/accounts";

export const setAccounts = (
  accounts: AccountReducerI
): ActionI<AccountReducerI> => ({
  type: Actions.SET_ACCOUNTS,
  payload: accounts,
});

export const addAccount = (account: AccountI): ActionI<AccountI> => ({
  type: Actions.ADD_ACCOUNT,
  payload: account,
});

export const deleteAccount = (cuskey: string | number): ActionI<string> => ({
  type: Actions.DELETE_ACCOUNT,
  payload: cuskey as string,
});
