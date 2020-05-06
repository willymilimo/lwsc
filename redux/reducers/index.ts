import { combineReducers } from "redux";
import { ThemeReducer } from "../../types/theme";
import theme from "./theme";
import notifications from "./notifications";
import accounts, { AccountReducerI } from "./accounts";
import serviceConstants, { ServiceConstantsI } from "./service-constants";
import { NotificationI } from "../../models/notification";

export interface RootReducerI {
  theme: ThemeReducer;
  notifications: NotificationI[];
  accounts: AccountReducerI;
  serviceConstants: ServiceConstantsI;
}

export default combineReducers({
  theme,
  notifications,
  accounts,
  serviceConstants,
});
