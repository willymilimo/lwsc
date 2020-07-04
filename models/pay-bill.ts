import { PaymentType } from "../types/payment";

export interface PayBill {
  meter_number: string;
  first_name: string;
  last_name: string;
  customer_type: PaymentType;
  amount: string;
  payment_channel: string;
  phone_number: string;
  email: string;
}
