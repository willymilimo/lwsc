import { combineReducers } from "redux";
import { ThemeType } from "../../types/theme";
import theme from "./theme";

export interface RootReducerI {
  theme: ThemeType;
}

const rootReducer = combineReducers({
  theme,
});

export default rootReducer;
