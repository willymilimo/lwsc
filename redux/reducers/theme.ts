import Actions, { ActionI } from "../Actions";
import Styles from "../../constants/Styles";
import { ThemeReducer } from "../../types/theme";
import Strings from "../../constants/Strings";
import { AsyncStorage } from "react-native";

const initState = {
  name: Strings.WHITE_THEME,
  theme: Styles[Strings.WHITE_THEME],
};

export default function (state = initState, action: ActionI): ThemeReducer {
  switch (action.type) {
    case Actions.SET_THEME:
      state = {
        ...state,
        theme: action.payload,
      };
      break;

    case Actions.SET_THEME_NAME:
      state = { ...state, name: action.payload };
      break;

    case Actions.SET_THEME_REDUCER:
      state = action.payload;
      break;
  }

  if (action.payload) {
    console.log(action);
    AsyncStorage.setItem(Strings.THEME_STORAGE, JSON.stringify(state));
  }

  return state;
}
