import { combineReducers } from "redux";
import theme from "./theme";
import notifications from "./notifications";
import payPoints from "./pay-points";
import paymentHistory from "./payment-history";
import accounts, { AccountReducerI } from "./accounts";
import user from "./user";
import services from "./services";
import billGroups from "./bill-groups";
import bookNumbers from "./book-number";
import properties from "./meter-reading-proerties";
import serviceConstants, { ServiceConstantsI } from "./service-constants";
import { NotificationI } from "../../models/notification";
import { PayPointReducer } from "../../types/paypoint";
import { ServiceItemI } from "../../models/service-item";
import { StatementI } from "../../models/statement";
import { BillGroupReducerI } from "./bill-groups";
import { BookNumberReducerI } from "./book-number";
import { MeterReadingPropertiesReducerI } from "./meter-reading-proerties";
import { ThemeReducer } from "../../types/theme";

export interface RootReducerI {
  theme: ThemeReducer;
  notifications: NotificationI[];
  accounts: AccountReducerI;
  serviceConstants: ServiceConstantsI;
  payPoints: PayPointReducer;
  paymentHistory: StatementI[];
  services: ServiceItemI[];
  user: string;
  billGroups: BillGroupReducerI;
  bookNumbers: BookNumberReducerI;
  properties: MeterReadingPropertiesReducerI;
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
  billGroups,
  bookNumbers,
  properties,
});
