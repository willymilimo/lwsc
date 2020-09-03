import axios, { AxiosResponse } from "axios";
import { encode as btoa } from "base-64";
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
import { ServiceInvoiceI } from "./service-invoice";
import mime from "mime";
import { Buffer } from "buffer";

// axios.defaults.auth = Strings.API_CREDS;
// axios.defaults.headers.Authorization = "Basic bHdzY19tb2JpbGVfYXBwX2Rldjojd3d3QDEyMzRfbHdzY19hcHA=";
axios.defaults.headers.Authorization =
  "Basic " +
  btoa(`${Strings.API_CREDS.username}:${Strings.API_CREDS.password}`);
// console.log(`${Strings.API_CREDS.username}:${Strings.API_CREDS.password}`);
// console.log(axios.defaults.headers.Authorization);
// console.log("Basic bHdzY19tb2JpbGVfYXBwX2Rldjojd3d3QDEyMzRfbHdzY19hcHA=")

// axios.defaults.baseURL = "http://41.72.107.14:3000/api/v1/";
axios.defaults.baseURL = Strings.API_BASE_URL;
//http://41.72.107.14:3020/
axios.defaults.timeout = 6000;

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
): Promise<
  AxiosResponse<
    IResponse<{
      transaction_id: string;
      full_redirect_url: string;
    }>
  >
> => {
  // console.log(service);
  return await axios.post("services/applications/create", service);
};

export const applyForPaymentSchedule = async (account: AccountI) => {
  return await axios.post("apply-for-payment-schedule", account);
};

export const upload = async (base64: string): Promise<any> => {
  let apiUrl = "https://lwsc.microtech.co.zm/api/v1/uploads/files/disk/create";

  base64 = `data:image/jpeg;base64,${base64}`;

  // console.log(base64.substr(0, 100));
  // base64 =
  //   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAB+FBMVEUAAAA/mUPidDHiLi5Cn0XkNTPmeUrkdUg/m0Q0pEfcpSbwaVdKskg+lUP4zA/iLi3msSHkOjVAmETdJSjtYFE/lkPnRj3sWUs8kkLeqCVIq0fxvhXqUkbVmSjwa1n1yBLepyX1xxP0xRXqUkboST9KukpHpUbuvRrzrhF/ljbwaljuZFM4jELaoSdLtElJrUj1xxP6zwzfqSU4i0HYnydMtUlIqUfywxb60AxZqEXaoifgMCXptR9MtklHpEY2iUHWnSjvvRr70QujkC+pUC/90glMuEnlOjVMt0j70QriLS1LtEnnRj3qUUXfIidOjsxAhcZFo0bjNDH0xxNLr0dIrUdmntVTkMoyfL8jcLBRuErhJyrgKyb4zA/5zg3tYFBBmUTmQTnhMinruBzvvhnxwxZ/st+Ktt5zp9hqota2vtK6y9FemNBblc9HiMiTtMbFtsM6gcPV2r6dwroseLrMrbQrdLGdyKoobKbo3Zh+ynrgVllZulTsXE3rV0pIqUf42UVUo0JyjEHoS0HmsiHRGR/lmRz/1hjqnxjvpRWfwtOhusaz0LRGf7FEfbDVmqHXlJeW0pbXq5bec3fX0nTnzmuJuWvhoFFhm0FtrziBsjaAaDCYWC+uSi6jQS3FsSfLJiTirCOkuCG1KiG+wSC+GBvgyhTszQ64Z77KAAAARXRSTlMAIQRDLyUgCwsE6ebm5ubg2dLR0byXl4FDQzU1NDEuLSUgC+vr6urq6ubb29vb2tra2tG8vLu7u7uXl5eXgYGBgYGBLiUALabIAAABsElEQVQoz12S9VPjQBxHt8VaOA6HE+AOzv1wd7pJk5I2adpCC7RUcHd3d3fXf5PvLkxheD++z+yb7GSRlwD/+Hj/APQCZWxM5M+goF+RMbHK594v+tPoiN1uHxkt+xzt9+R9wnRTZZQpXQ0T5uP1IQxToyOAZiQu5HEpjeA4SWIoksRxNiGC1tRZJ4LNxgHgnU5nJZBDvuDdl8lzQRBsQ+s9PZt7s7Pz8wsL39/DkIfZ4xlB2Gqsq62ta9oxVlVrNZpihFRpGO9fzQw1ms0NDWZz07iGkJmIFH8xxkc3a/WWlubmFkv9AB2SEpDvKxbjidN2faseaNV3zoHXvv7wMODJdkOHAegweAfFPx4G67KluxzottCU9n8CUqXzcIQdXOytAHqXxomvykhEKN9EFutG22p//0rbNvHVxiJywa8yS2KDfV1dfbu31H8jF1RHiTKtWYeHxUvq3bn0pyjCRaiRU6aDO+gb3aEfEeVNsDgm8zzLy9egPa7Qt8TSJdwhjplk06HH43ZNJ3s91KKCHQ5x4sw1fRGYDZ0n1L4FKb9/BP5JLYxToheoFCVxz57PPS8UhhEpLBVeAAAAAElFTkSuQmCC";

  return await axios.post(
    apiUrl,
    { photo: base64, image_type: "base64" },
    {
      headers: {
        "Content-type": "application/json",
        // Authorization:
        //   "Basic " +
        //   btoa(`${Strings.API_CREDS.username}:${Strings.API_CREDS.password}`),
      },
    }
  );
};

export const uploadFiles = async (
  uris: string[]
): Promise<AxiosResponse<IResponse<UploadFileI[]>>> => {
  const fd = new FormData();
  uris.forEach((uri, i) => {
    // fd.append(`reading${i}`, file);
    const newImageUri = "file:///" + uri.split("file:/").join("");
    // console.log(uri);
    // console.log(newImageUri);

    // let uriParts = uri.split(".");
    // let fileType = uriParts[uriParts.length - 1];
    fd.append("photo", {
      uri,
      name: newImageUri.split("/").pop(),
      // type: mime.getType(newImageUri),
    } as any);
  });

  return await axios.post(
    "https://lwsc.microtech.co.zm/api/v1/uploads/files/disk/create",
    fd,
    {
      headers: {
        // timeout: "6000",
        "content-type": "multipart/form-data",
        Authorization:
          "Basic " +
          btoa(`${Strings.API_CREDS.username}:${Strings.API_CREDS.password}`),
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
  // console.log(startDate, endDate);
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

export const fetchServiceInvoice = async (
  service_type: string,
  account_number: string
): Promise<AxiosResponse<IResponse<ServiceInvoiceI>>> => {
  return await axios.get(
    `services/invoices/fetch?service_type=${service_type}&account_number=${account_number}`
  );
};
