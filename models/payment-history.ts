export interface PaymentHistoryI {
  _id: string;
  payment_date: Date;
  payment_description?: string;
  payment_type: string;
  amount: number;
}

export class PaymentHistory implements PaymentHistoryI {
  _id: string;
  payment_date: Date;
  payment_description?: string | undefined;
  payment_type: string;
  amount: number;

  constructor({
    _id,
    payment_date,
    payment_description,
    payment_type,
    amount,
  }: PaymentHistoryI) {
    this._id = _id;
    this.payment_date = new Date(payment_date);
    this.payment_description = payment_description;
    this.payment_type = payment_type;
    this.amount = amount;
  }
}
