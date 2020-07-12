import { combineReducers } from "redux";
import { ThemeReducer } from "../../types/theme";
import theme from "./theme";
import notifications from "./notifications";
import payPoints from "./pay-points";
import paymentHistory from "./payment-history";
import accounts, { AccountReducerI } from "./accounts";
import user from "./user";
import services from "./services";
import serviceConstants, { ServiceConstantsI } from "./service-constants";
import { NotificationI } from "../../models/notification";
import { PaymentHistoryI } from "../../models/payment-history";
import { PayPointReducer } from "../../types/paypoint";
import { ServiceItemI } from "../../models/service-item";

export interface RootReducerI {
  theme: ThemeReducer;
  notifications: NotificationI[];
  accounts: AccountReducerI;
  serviceConstants: ServiceConstantsI;
  payPoints: PayPointReducer;
  paymentHistory: PaymentHistoryI[];
  services: ServiceItemI[];
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
  services,
});
