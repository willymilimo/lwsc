import Actions, { ActionI } from "../Actions";

export const setPushToken = (
  token: string
): ActionI<string> => ({
  type: Actions.SET_PUSH_TOKEN_SUBMITTED,
  payload: token,
});
