import { PayPointI } from "../models/pay-point";

export interface PayPointReducer {
  [region: string]: PayPointI[];
}