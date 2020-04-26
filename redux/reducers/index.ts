import { combineReducers } from "redux";
import { ThemeReducer } from "../../types/theme";
import theme from "./theme";
import notifications from "./notifications";
import accounts from "./accounts";
import { NotificationI } from "../../models/notification";
import { AccountI } from "../../models/account";

export interface RootReducerI {
  theme: ThemeReducer;
  notifications: NotificationI[];
  accounts: AccountI[];
}

export default combineReducers({
  theme,
  notifications,
  accounts,
});
