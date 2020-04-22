import { GestureResponderEvent } from "react-native";

export interface BillI {
  _id: string;
  name: string;
  address: string;
  meter_number: string;
  account_number: string;
  meter_reading: number;
  usage: number;
  amount_due: number;
}

export class Bill implements BillI {
  _id: string;
  name: string;
  address: string;
  meter_number: string;
  account_number: string;
  meter_reading: number;
  usage: number;
  amount_due: number;

  constructor({
    _id,
    name,
    address,
    meter_number,
    account_number,
    meter_reading,
    usage,
    amount_due,
  }: BillI) {
    this._id = _id;
    this.name = name;
    this.address = address;
    this.meter_number = meter_number;
    this.account_number = account_number;
    this.meter_reading = meter_reading;
    this.usage = usage;
    this.amount_due = amount_due;
  }
}
