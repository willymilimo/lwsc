import Actions, { ActionI } from "../Actions";

export const setLoadTime = (loadTime: Date): ActionI<Date> => ({
  type: Actions.SET_LOAD_TIME,
  payload: loadTime,
});
