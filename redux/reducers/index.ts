import { combineReducers } from "redux";
import { ThemeReducer } from "../../types/theme";
import theme from "./theme";
import notifications from "./notifications";
import accounts, { AccountReducerI } from "./accounts";
import { NotificationI } from "../../models/notification";

export interface RootReducerI {
  theme: ThemeReducer;
  notifications: NotificationI[];
  accounts: AccountReducerI;
}

export default combineReducers({
  theme,
  notifications,
  accounts,
});
