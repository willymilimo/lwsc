import axios, { AxiosResponse } from "axios";
import { IResponse } from "./iresponse";
import { AccountI } from "./account";
import { IdentityType } from "../types/identity-type";
import { PaymentType } from "../types/payment";
import { PaymentI } from "./payment";
import {
  MeterReading,
  BillGroupI,
  BookNumberI,
  PropertyI,
  MeterReadingI,
} from "./meter-reading";
import { ServiceItemI } from "./service-item";
import { ServiceApplicationI } from "./service-application";
import { UploadFileI } from "./upload-file";
import { StatementI } from "./statement";
import { ServiceReportI } from "./service-report";
import { NotesI, NoAccessI } from "./access-description";
import { NotificationI } from "./notification";
import { PaypointI } from "./pay-point";
import { ConsumptionI } from "./consumption";
import { PaymentChannelI } from "../types/payment-channel";
import Strings from "../constants/Strings";

// axios.defaults.auth = Strings.API_CREDS;
axios.defaults.headers.Authorization =
  "Basic bHdzY19tb2JpbGVfYXBwX2Rldjojd3d3QDEyMzRfbHdzY19hcHA=";
// axios.defaults.baseURL = "http://41.72.107.14:3000/api/v1/";
axios.defaults.baseURL = Strings.API_BASE_URL;
//http://41.72.107.14:3020/
// axios.defaults.timeout = 60000;

// console.log(axios.defaults.baseURL);

const getPayUrl = (paymentType: PaymentType): string | null => {
  switch (paymentType) {
    case PaymentType.AIRTEL_MONEY:
      return "";
    case PaymentType.MTN_MONEY:
      return "";
    case PaymentType.ZAMTEL_KWACHA:
      return "";
    case PaymentType["VISA/MasterCard"]:
      return "";
  }

  return null;
};

export default axios;

export const api_root = "http://41.72.107.14:3000/api/v1";

export const getCustomerByAccountNumber = async (
  account_number: string
): Promise<AxiosResponse<IResponse<AccountI>>> => {
  return await axios.get(`customers?account_number=${account_number}`);
};

export const getCustomerByMeterNumber = async (
  meterNumber: string
): Promise<AxiosResponse<IResponse<PropertyI | any>>> => {
  return new Promise((resolve, reject) => {
    resolve({
      statusText: "Ok",
      headers: {},
      config: {},
      status: 200,
      data: {
        error: "",
        message: "",
        success: true,
        payload: {},
      },
    });
  });
};

export const makeMoMoPayment = async (payment: PaymentI) => {
  return await axios.post(`billing/paybill`, payment);
};

export const makePayment = async (
  payment: PaymentI
): Promise<
  AxiosResponse<
    IResponse<{
      transaction_id: string;
      full_redirect_url: string;
    }>
  >
> => {
  // console.log(payment);
  return await axios.post(`billing/paybill`, payment, { timeout: 60000 });
};

export const fetchServices = async (): Promise<
  AxiosResponse<IResponse<ServiceItemI[]>>
> => {
  return await axios.get(`services/types/fetch`);
};

export const applyForService = async (
  service: ServiceApplicationI
): Promise<AxiosResponse<IResponse>> => {
  console.log(service);
  return await axios.post("services/applications/create", service);
};

export const applyForPaymentSchedule = async (account: AccountI) => {
  return await axios.post("apply-for-payment-schedule", account);
};

export const uploadFiles = async (
  uris: string[]
): Promise<AxiosResponse<IResponse<UploadFileI[]>>> => {
  const fd = new FormData();
  uris.forEach((uri, i) => {
    // fd.append(`reading${i}`, file);
    let uriParts = uri.split(".");
    let fileType = uriParts[uriParts.length - 1];
    fd.append("photo", {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    } as any);
  });

  return await axios.post(
    "https://lwsc.microtech.co.zm/api/v1/uploads/files/disk/create",
    fd,
    {
      headers: {
        "content-type": "multipart/form-data",
      },
    }
  );
};

export const submitMeterReading = async (reading: MeterReading) => {
  return await axios.post("billing/meter-reading/create", reading);
};

export const fetchPaymentHistory = async (
  identity: string,
  type: IdentityType
): Promise<AxiosResponse<IResponse<StatementI[]>>> => {
  return await axios.get(
    `payments/statement/transactions/fetch?identifier=${identity}&type=${type}`
  );
};

export const reportLeakage = async (
  report: ServiceReportI
): Promise<AxiosResponse<IResponse<string>>> => {
  return await axios.post("service-desk/leakages/create", report);
};

export const submitComplaint = async (
  report: ServiceReportI
): Promise<AxiosResponse<IResponse<string>>> => {
  return await axios.post("service-desk/leakages/create", report);
};

export const fetchAllBillGroups = async (): Promise<
  AxiosResponse<
    IResponse<{ recordset: BillGroupI[]; recordsets: [BillGroupI[]] }>
  >
> => {
  return await axios.get("billing/bill-groups/fetch");
};

export const fetchAllBookNumbers = async (): Promise<
  AxiosResponse<
    IResponse<{ recordset: BookNumberI[]; recordsets: [BookNumberI[]] }>
  >
> => {
  return await axios.get("billing/book-numbers/fetch?query_type=all");
};

export const fetchAllCustomerDetailsByBillGroup = async (
  bn: BookNumberI
): Promise<
  AxiosResponse<
    IResponse<{ recordset: PropertyI[]; recordsets: [PropertyI[]] }>
  >
> => {
  //  `billing/walk-routes/fetch?query_type=book_number&bill_group=${bn.BILLGROUP}&book_number=${bn.CODE}`,
  return await axios.get(
    `billing/walk-routes/fetch?query_type=bill_group&bill_group=${bn.BILLGROUP}&book_number=${bn.CODE}&walk_number=${bn.NO_WALKS}`,
    { timeout: 600000 }
  );
};

export const fetchAccessNotes = async (): Promise<
  AxiosResponse<
    IResponse<{
      recordset: NotesI[];
      recordsets: [NotesI[]];
    }>
  >
> => {
  return await axios.get(
    "billing/notes-access-descriptions/fetch?query_type=notes"
  );
};

export const fetchNoAccessOptions = async (): Promise<
  AxiosResponse<
    IResponse<{
      recordset: NoAccessI[];
      recordsets: [NoAccessI[]];
    }>
  >
> => {
  return await axios.get(
    "billing/notes-access-descriptions/fetch?query_type=no_access"
  );
};

export const createMeterReading = async (
  reading: MeterReadingI
): Promise<AxiosResponse<IResponse<boolean>>> => {
  return await axios.post("billing/meter-reading/create", reading);
};

export const fetchNotifications = async (): Promise<
  AxiosResponse<IResponse<NotificationI[]>>
> => {
  return await axios.get("notifications");
};

export const submitPushToken = async (
  token: string
): Promise<AxiosResponse<IResponse<boolean>>> => {
  return await axios.post("notifications/push/token/create", { token });
};

export const fetchPayPoints = async (): Promise<
  AxiosResponse<IResponse<PaypointI[]>>
> => {
  return await axios.get("gis/pay-points/fetch");
};

export const fetchComsumption = async (
  accountNumber: string,
  startDate: string,
  endDate: string
): Promise<AxiosResponse<IResponse<{ recordset: ConsumptionI[] }>>> => {
  return await axios.get(
    `billing/consumption/records/fetch?account_number=${accountNumber}&lower_limit_date=${startDate}&upper_limit_date=${endDate}`
  );
};

export const login = async (
  username: string,
  manNumber: string
): Promise<AxiosResponse<IResponse<string>>> => {
  return await axios.post("billing/meter-reading/authenticate-reader", {
    username,
    man_number: manNumber,
  });
};

export const validateBillWindow = async (
  billGroup: string
): Promise<AxiosResponse<IResponse<{ CYCLE_ID: number }>>> => {
  console.log(
    `billing/window-status/fetch?source=edams&bill_group=${billGroup}`
  );
  return await axios.get(
    `billing/window-status/fetch?source=edams&bill_group=${billGroup}`
  );
};

export const fetchConfigStatus = async (): Promise<
  AxiosResponse<IResponse<{ status: string; update_link: string }>>
> => {
  return await axios.get("system/configurations/status/fetch");
};

export const fetchPaymentChannels = async (): Promise<
  AxiosResponse<IResponse<PaymentChannelI[]>>
> => {
  return await axios.get(
    "system/configurations/payments/channels/fetch?active=true"
  );
};
