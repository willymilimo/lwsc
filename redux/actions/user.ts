import Actions, { ActionI } from "../Actions";

export const setManNumber = (payload: string): ActionI<string> => ({
  type: Actions.SET_MAN_NUMBER,
  payload,
});

export const unsetManNumber = (): ActionI<null> => ({
  type: Actions.SET_THEME,
  payload: null,
});
