import { PaymentType } from "../types/payment";

export interface PaymentI {
  account_number?: string;
  amount: number | string;
  payment_type: PaymentType;
  customer_phone_number?: string;
  email?: string;
}

export type PaymentT = PaymentI;

export class Payment implements PaymentI {
  account_number?: string;
  amount: number | string;
  payment_type: PaymentType;
  customer_phone_number?: string;
  email?: string;

  constructor({
    account_number,
    amount,
    payment_type,
    customer_phone_number,
    email,
  }: PaymentI) {
    this.account_number = account_number;
    this.amount = amount;
    this.payment_type = PaymentType[payment_type];
    this.customer_phone_number = customer_phone_number;
    this.email = email;
  }
}
