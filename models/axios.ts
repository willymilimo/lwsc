import axios, { AxiosResponse } from "axios";
import Strings from "../constants/Strings";
import { IResponse } from "./iresponse";
import { AccountI } from "./account";
import { AddType } from "../types/add-type";

// axios.defaults.headers.common["username"] = Strings.API_USERNAME;
// axios.defaults.headers.common["password"] = Strings.API_PASSWORD;

export default axios;

const api_root = "http://41.72.107.14:3000/api/v1";

export const getCustomerByAccountNumber = async (
  account_number: string,
  type: AddType
): Promise<AxiosResponse<IResponse<AccountI>>> => {
  const url =
    type === AddType.account
      ? `${api_root}/customers?account_number=${account_number}`
      : `${api_root}/customers?meter_number=${account_number}`;
      
  return await axios.get(url);
};
