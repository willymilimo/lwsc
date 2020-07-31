import Actions, { ActionI } from "../Actions";

export const setPushTokenSubmitted = (
  isSubmitted: boolean
): ActionI<boolean> => ({
  type: Actions.SET_PUSH_TOKEN_SUBMITTED,
  payload: isSubmitted,
});
