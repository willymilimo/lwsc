//SET_ACTIVE_ACCOUNT

import Actions, { ActionI } from "../Actions";
import { ActiveAccountReducerI } from "../reducers/active-account";

export const setActiveAccount = (
  account: ActiveAccountReducerI
): ActionI<ActiveAccountReducerI> => ({
  type: Actions.SET_ACTIVE_ACCOUNTS,
  payload: account,
});

export const unsetActiveAccount = (): ActionI<null> => ({
  type: Actions.UNSET_ACTIVE_ACCOUNT,
  payload: null,
});
