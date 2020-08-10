import Actions, { ActionI } from "../Actions";
import { UserReducerI } from "../reducers/user";

export const setUserReducer = (
  userReducer: UserReducerI
): ActionI<UserReducerI> => ({
  type: Actions.SET_USER_REDUCER,
  payload: userReducer,
});

export const setManNumber = (payload: string): ActionI<string> => ({
  type: Actions.SET_MAN_NUMBER,
  payload,
});

export const unsetManNumber = (): ActionI<null> => ({
  type: Actions.UNSET_MAN_NUMBER,
  payload: null,
});

export const setAuthToken = (token: string): ActionI<string> => ({
  type: Actions.SET_USER_TOKEN,
  payload: token,
});

export const deleteAuthToken = (): ActionI<null> => ({
  type: Actions.DELETE_USER_TOKEN,
  payload: null,
});
