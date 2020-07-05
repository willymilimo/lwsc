import { PaymentType } from "../types/payment";
import { CustomerType } from "../types/customer-type";
import { PaymentChannel } from "../types/payment-channel";

export interface PaymentI {
  account_number?: string;
  meter_number?: string;
  first_name: string;
  last_name: string;
  customer_type: CustomerType;
  amount: string;
  payment_channel: PaymentChannel;
  phone_number: string;
  email?: string;
}

export type PaymentT = PaymentI;

export class Payment implements PaymentI {
  account_number?: string | undefined;
  meter_number?: string | undefined;
  first_name: string;
  last_name: string;
  customer_type: CustomerType;
  amount: string;
  payment_channel: PaymentChannel;
  phone_number: string;
  email?: string | undefined;

  constructor({
    account_number,
    meter_number,
    amount,
    first_name,
    last_name,
    customer_type,
    payment_channel,
    phone_number,
    email,
  }: PaymentI) {
    this.account_number = account_number;
    this.meter_number = meter_number;
    this.amount = amount;
    this.first_name = first_name;
    this.last_name = last_name;
    this.customer_type = customer_type;
    this.payment_channel = payment_channel;
    this.phone_number = phone_number;
    this.email = email;
  }
}
