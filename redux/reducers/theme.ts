import ActionI, { Actions } from "../Actions";
import { ThemeType } from "../../types/theme";

export default function (state = ThemeType.white, action: ActionI): ThemeType {
  switch (action.type) {
    case Actions.SET_THEME:
      return action.payload;
  }

  return state;
}
