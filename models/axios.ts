import axios, { AxiosResponse } from "axios";
import Strings from "../constants/Strings";
import { IResponse } from "./iresponse";
import { AccountI } from "./account";
import { AddType } from "../types/add-type";
import { PaymentType } from "../types/payment";
import { PaymentI } from "./payment";

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
    case PaymentType.VISA:
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

export const makePayment = async (payment: PaymentI) => {
  // console.log(payment);
  return await axios.post(`transactions/make-payment`, payment);
};

export const applyForPaymentSchedule = async (account: AccountI) => {
  return await axios.post("apply-for-payment-schedule", account);
};
