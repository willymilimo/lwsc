import { AccountI } from "../../models/account";
import Actions, { ActionI } from "../Actions";
import { AccountReducerI } from "../reducers/accounts";
import { PropertyI } from "../../models/meter-reading";

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

export const addAccountProperty = (
  property: PropertyI
): ActionI<PropertyI> => ({
  type: Actions.ADD_ACCUNT_PROPERTY,
  payload: property,
});

export const deleteAccount = (cuskey: string | number): ActionI<string> => ({
  type: Actions.DELETE_ACCOUNT,
  payload: cuskey as string,
});
