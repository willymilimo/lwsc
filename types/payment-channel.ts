export enum PaymentChannel {
  "Airtel Money" = "airtel",
  airtel = "Airtel Money",

  Zampay = "zamtel",
  zamtel = "Zampay",

  "MTN Money" = "mtn",
  mtn = "MTN Money",

  "VISA/MasterCard" = "visa_master_card",
  visa_master_card = "VISA/MasterCard",
}

export interface PaymentChannelI {
  active: boolean;
  _id: string;
  title: string;
  id: PaymentChannel;
  trans_code: string;
  trans_scode: string;
  remarks: string;
  stamp_user: string;
  __v: number;
}

export class PaymentChannelC implements PaymentChannelI {
  active: boolean;
  _id: string;
  title: string;
  id: PaymentChannel;
  trans_code: string;
  trans_scode: string;
  remarks: string;
  stamp_user: string;
  __v: number;

  constructor({
    active,
    _id,
    title,
    id,
    trans_code,
    trans_scode,
    remarks,
    stamp_user,
    __v,
  }: PaymentChannelI) {
    this.active = active;
    this.title = title;
    this._id = id;
    this.id = id;
    this.trans_code = trans_code;
    this.trans_scode = trans_scode;
    this.remarks = remarks;
    this.stamp_user = stamp_user;
    this.__v = __v;
  }
}
