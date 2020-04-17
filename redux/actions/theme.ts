import { ThemeType } from "../../types/theme";
import ActionI, { Actions } from "../Actions";

export const setTheme = (theme: ThemeType): ActionI => {
  return { type: Actions.SET_THEME, payload: theme };
};
