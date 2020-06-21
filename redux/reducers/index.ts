import { combineReducers } from "redux";
import { ThemeReducer } from "../../types/theme";
import theme from "./theme";
import notifications from "./notifications";
import payPoints from "./pay-points";
import paymentHistory from "./payment-history";
import accounts, { AccountReducerI } from "./accounts";
import user from "./user";
import serviceConstants, { ServiceConstantsI } from "./service-constants";
import { NotificationI } from "../../models/notification";
import { PayPointI } from "../../models/pay-point";
import { PaymentHistoryI } from "../../models/payment-history";

export interface RootReducerI {
  theme: ThemeReducer;
  notifications: NotificationI[];
  accounts: AccountReducerI;
  serviceConstants: ServiceConstantsI;
  payPoints: PayPointI[];
  paymentHistory: PaymentHistoryI[];
  user: string;
}

export default combineReducers({
  theme,
  notifications,
  accounts,
  serviceConstants,
  payPoints,
  paymentHistory,
  user,
});
