import axios, { AxiosResponse } from "axios";
import { IResponse } from "./iresponse";
import { AccountI } from "./account";
import { AddType } from "../types/add-type";
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

// axios.defaults.auth = Strings.API_CREDS;
axios.defaults.headers.Authorization =
  "Basic bHdzY19tb2JpbGVfYXBwX2Rldjojd3d3QDEyMzRfbHdzY19hcHA=";
axios.defaults.baseURL = "http://41.72.107.14:3000/api/v1/";
// axios.defaults.timeout = 60000;

// console.log(axios.defaults.headers);

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

const api_root = "http://41.72.107.14:3000/api/v1";

export const getCustomerByAccountNumber = async (
  account_number: string,
  type: AddType
): Promise<AxiosResponse<IResponse<AccountI>>> => {
  const url =
    type === AddType.account
      ? `customers?account_number=${account_number}`
      : `customers?meter_number=${account_number}`;

  return await axios.get(url);
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

  return await axios.post("uploads/files/disk/create", fd, {
    headers: {
      "content-type": "multipart/form-data",
    },
  });
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
