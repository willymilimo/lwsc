export interface ServiceInvoiceI {
  active: boolean;
  _id: string;
  service_type: string;
  customer_type: string;
  penalty_charge: number;
  fee_charge: number;
  total_charge: number;
}

export class ServiceInvoice implements ServiceInvoiceI {
  active: boolean;
  _id: string;
  service_type: string;
  customer_type: string;
  penalty_charge: number;
  fee_charge: number;
  total_charge: number;

  constructor({
    active,
    _id,
    service_type,
    customer_type,
    penalty_charge,
    fee_charge,
    total_charge,
  }: ServiceInvoiceI) {
    this.active = active;
    this._id = _id;
    this.service_type = service_type;
    this.customer_type = customer_type;
    this.penalty_charge = penalty_charge;
    this.fee_charge = fee_charge;
    this.total_charge = total_charge;
  }
}
