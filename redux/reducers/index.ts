import { combineReducers } from "redux";
import { ThemeReducer } from "../../types/theme";
import theme from "./theme";
import notifications from "./notifications";
import payPoints from "./pay-points";
import accounts, { AccountReducerI } from "./accounts";
import serviceConstants, { ServiceConstantsI } from "./service-constants";
import { NotificationI } from "../../models/notification";
import { PayPointI } from "../../models/pay-point";

export interface RootReducerI {
  theme: ThemeReducer;
  notifications: NotificationI[];
  accounts: AccountReducerI;
  serviceConstants: ServiceConstantsI;
  payPoints: PayPointI[];
}

export default combineReducers({
  theme,
  notifications,
  accounts,
  serviceConstants,
  payPoints,
});
