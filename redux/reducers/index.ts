import { combineReducers } from "redux";
import { ThemeReducer } from "../../types/theme";
import theme from "./theme";
import notifications from "./notifications";
import { NotificationI } from "../../models/notification";

export interface RootReducerI {
  theme: ThemeReducer;
  notifications: NotificationI[];
}

export default combineReducers({
  theme,
  notifications,
});;
