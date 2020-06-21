import Actions, { ActionI } from "../Actions";
import Styles from "../../constants/Styles";
import { ThemeReducer, ThemeType } from "../../types/theme";
import Strings from "../../constants/Strings";
import { AsyncStorage } from "react-native";

export default function (
  state: string | null = null,
  action: ActionI<any>
): string | null {
  switch (action.type) {
    case Actions.SET_MAN_NUMBER:
      state = action.payload;
      break;

    case Actions.UNSET_MAN_NUMBER:
      state = "";
      break;
  }

  if (action.payload) {
    AsyncStorage.setItem(Strings.USER_STORAGE, JSON.stringify(state));
  }

  return state;
}
