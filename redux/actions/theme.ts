import { ThemeType, ThemeReducer } from "../../types/theme";
import Actions, { ActionI } from "../Actions";

export const setThemeReducer = (payload: ThemeReducer) => ({
  type: Actions.SET_THEME_REDUCER,
  payload,
});

export const setTheme = (theme: ThemeType): ActionI => ({
  type: Actions.SET_THEME,
  payload: theme,
});

export const setName = (name: string): ActionI => ({
  type: Actions.SET_THEME_NAME,
  payload: name,
});
