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
import accessNotes from "./access-notes";
import activeAccount from "./active-account";
import pushTokenSubmitted from "./push-token";
import serviceConstants, { ServiceConstantsI } from "./service-constants";
import { NotificationI } from "../../models/notification";
import { ServiceItemI } from "../../models/service-item";
import { StatementI } from "../../models/statement";
import { BillGroupReducerI } from "./bill-groups";
import { BookNumberReducerI } from "./book-number";
import { MeterReadingPropertiesReducerI } from "./meter-reading-proerties";
import { ThemeReducer } from "../../types/theme";
import { AccessNotesReducerI } from "./access-notes";
import { PaypointI } from "../../models/pay-point";

export interface RootReducerI {
  theme: ThemeReducer;
  notifications: NotificationI[];
  accounts: AccountReducerI;
  serviceConstants: ServiceConstantsI;
  payPoints: PaypointI[];
  paymentHistory: StatementI[];
  services: ServiceItemI[];
  user: string;
  billGroups: BillGroupReducerI;
  bookNumbers: BookNumberReducerI;
  properties: MeterReadingPropertiesReducerI;
  accessNotes: AccessNotesReducerI;
  activeAccount: string;
  pushTokenSubmitted: boolean;
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
  accessNotes,
  activeAccount,
  pushTokenSubmitted,
});
