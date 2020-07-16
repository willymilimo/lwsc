import axios, { AxiosResponse } from "axios";
import Strings from "../constants/Strings";
import { IResponse } from "./iresponse";
import { AccountI } from "./account";
import { AddType } from "../types/add-type";
import { PaymentType, PaymentT } from "../types/payment";
import { PaymentI } from "./payment";
import { MeterReading } from "./meter-reading";
import { ServiceItemI } from "./service-item";
import { ServiceApplicationI } from "./service-application";
import { PaymentHistoryI } from "./payment-history";

// axios.defaults.headers.common["username"] = Strings.API_USERNAME;
// axios.defaults.headers.common["password"] = Strings.API_PASSWORD;
axios.defaults.baseURL = "http://41.72.107.14:3000/api/v1/";

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
  return await axios.post(`applications/create`, service);
};

export const applyForPaymentSchedule = async (account: AccountI) => {
  return await axios.post("apply-for-payment-schedule", account);
};

export const uploadFiles = async (uris: string[]) => {
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

  return await axios.post("uploads/files/create", fd, {
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
  type: AddType
): Promise<AxiosResponse<IResponse<PaymentHistoryI[]>>> => {
  return await axios.get("payment-history");
};
