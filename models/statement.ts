import {
  PaymentChannel,
  PaymentChannelI,
  PaymentChannelC,
} from "../types/payment-channel";

export interface TransactionResponseI {
  success: boolean;
  message: string;
}

export class TransactionResponse implements TransactionResponseI {
  success: boolean;
  message: string;

  constructor({ success, message }: TransactionResponseI) {
    this.success = success;
    this.message = message;
  }
}

interface ConfirmTransResponseI {
  _id: string;
  bnk: string;
  refNo: string;
  transactionId: string;
  status: string;
  created_on: Date;
}

class ConfirmTransResponse implements ConfirmTransResponseI {
  _id: string;
  bnk: string;
  refNo: string;
  transactionId: string;
  status: string;
  created_on: Date;

  constructor({
    _id,
    bnk,
    refNo,
    transactionId,
    status,
    created_on,
  }: ConfirmTransResponseI) {
    this._id = _id;
    this.bnk = bnk;
    this.refNo = refNo;
    this.transactionId = transactionId;
    this.status = status;
    this.created_on = new Date(created_on);
  }
}

interface GenTokenResponseI {
  success: boolean;
  payload: { token: string };
}

export interface StatementI {
  init_trans_success: boolean;
  confirm_trans_success: boolean;
  _id: string;
  transaction_id: string;
  customer_type: string;
  account_number: string;
  meter_number: string;
  naration: string;
  first_name: string;
  last_name: string;
  amount: number;
  phone_number: string;
  email: string;
  bill_group: string;
  value_date: string;
  created_on: Date;
  payment_channel: PaymentChannel | PaymentChannelI;
  init_trans_response: TransactionResponseI | object;
  fullName?: string;
  gen_token_response?: GenTokenResponseI;
  confirm_trans_response: ConfirmTransResponseI | object;
}

export class Statement implements StatementI {
  init_trans_success: boolean;
  confirm_trans_success: boolean;
  _id: string;
  transaction_id: string;
  customer_type: string;
  account_number: string;
  meter_number: string;
  naration: string;
  first_name: string;
  last_name: string;
  amount: number;
  phone_number: string;
  email: string;
  bill_group: string;
  value_date: string;
  created_on: Date;
  payment_channel: PaymentChannel | PaymentChannelI;
  init_trans_response: TransactionResponseI | object;
  gen_token_response?: GenTokenResponseI;
  confirm_trans_response: ConfirmTransResponseI | object;

  constructor({
    _id,
    init_trans_success,
    confirm_trans_success,
    transaction_id,
    customer_type,
    account_number,
    meter_number,
    naration,
    first_name,
    last_name,
    amount,
    phone_number,
    email,
    bill_group,
    value_date,
    created_on,
    payment_channel,
    init_trans_response,
    gen_token_response,
    confirm_trans_response,
  }: StatementI) {
    this._id = _id;
    this.init_trans_success = init_trans_success;
    this.confirm_trans_success =
      confirm_trans_success ||
      (!!gen_token_response && gen_token_response.success);
    this.transaction_id = transaction_id;
    this.customer_type = customer_type;
    this.account_number = account_number;
    this.meter_number = meter_number;
    this.naration = naration;
    this.first_name = first_name;
    this.last_name = last_name;
    this.amount = amount;
    this.phone_number = phone_number;
    this.email = email;
    this.bill_group = bill_group;
    this.value_date = value_date;
    this.created_on = new Date(created_on);
    this.payment_channel = (payment_channel as PaymentChannelI)._id
      ? new PaymentChannelC(payment_channel as PaymentChannelI)
      : payment_channel;
    this.init_trans_response = init_trans_response
      ? new TransactionResponse(init_trans_response as TransactionResponseI)
      : {};
    this.gen_token_response = gen_token_response;
    this.confirm_trans_response = confirm_trans_response
      ? new ConfirmTransResponse(
          confirm_trans_response as ConfirmTransResponseI
        )
      : {};
  }

  get fullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }
}
