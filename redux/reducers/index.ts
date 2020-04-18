import { combineReducers } from "redux";
import { ThemeReducer } from "../../types/theme";
import theme from "./theme";

export interface RootReducerI {
  theme: ThemeReducer;
}

const rootReducer = combineReducers({
  theme,
});

export default rootReducer;
