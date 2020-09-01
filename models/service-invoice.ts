export interface ServiceInvoiceI {
  active: boolean;
  _id: string;
  service_type: string;
  customer_type: string;
  penalty_charge: number;
  fee_charge: number;
  total_charge: number;
  totalcharge: number;
  post_to_customer_balance: boolean;
}

export class ServiceInvoice implements ServiceInvoiceI {
  active: boolean;
  _id: string;
  service_type: string;
  customer_type: string;
  penalty_charge: number;
  fee_charge: number;
  total_charge: number;
  post_to_customer_balance: boolean;

  constructor({
    active,
    _id,
    service_type,
    customer_type,
    penalty_charge,
    fee_charge,
    total_charge,
    post_to_customer_balance
  }: ServiceInvoiceI) {
    this.active = active;
    this._id = _id;
    this.service_type = service_type;
    this.customer_type = customer_type;
    this.penalty_charge = penalty_charge;
    this.fee_charge = fee_charge;
    this.total_charge = total_charge;
    this.post_to_customer_balance = post_to_customer_balance;
  }

  get totalcharge(): number {
    return this.total_charge > 0
      ? this.total_charge
      : this.penalty_charge + this.fee_charge;
  }
}
