import Actions, { ActionI } from "../Actions";
import Styles from "../../constants/Styles";
import { ThemeReducer } from "../../types/theme";
import Strings from "../../constants/Strings";

const initState = {
  name: Strings.WHITE_THEME,
  theme: Styles[Strings.WHITE_THEME],
};

export default function (state = initState, action: ActionI): ThemeReducer {
  switch (action.type) {
    case Actions.SET_THEME:
      return {
        ...state,
        theme: action.payload,
      };

    case Actions.SET_THEME_NAME:
      return { ...state, name: action.payload };

    case Actions.SET_THEME_REDUCER:
      return action.payload;
  }

  return state;
}
