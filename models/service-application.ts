interface ServiceApp {
  service_type: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  area: string;
  address: string;
  description: string;
  post_to_customer_balance: boolean;
  bill_group: string;
  amount: number;
  phone_number: string;
  payment_channel: string;
}

export interface ServiceApplicationI {
  service_type: string;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  loc_coordinates?: { latitude: number; longitude: number };
  coordinates?: { latitude: number; longitude: number };
  address?: string;
  area?: string;
  description?: string;
  meter_number?: string;
  account_number?: string;
  customer_id: String;
  customer_account_id: String;
  bill_group?: string;
  post_service: boolean;
  fullname: string;
  post_to_customer_balance: boolean;
  amount?: number;
  billable: boolean;
  phone_number?: string;
  payment_channel: string;
  penalty_charge?: number;
  total_charge?: number;
}

export class ServiceApplication implements ServiceApplicationI {
  service_type: string;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  loc_coordinates?: { latitude: number; longitude: number };
  coordinates?: { latitude: number; longitude: number };
  address?: string;
  area?: string;
  description?: string;
  meter_number?: string;
  account_number?: string;
  customer_id: String;
  customer_account_id: String;
  bill_group?: string;
  post_service: boolean;
  post_to_customer_balance: boolean;
  amount?: number;
  phone_number?: string;
  payment_channel: string;
  billable: boolean;
  penalty_charge?: number;
  total_charge?: number;

  constructor({
    service_type,
    first_name,
    last_name,
    phone,
    email,
    loc_coordinates,
    coordinates,
    address,
    area,
    description,
    meter_number,
    account_number,
    customer_id,
    customer_account_id,
    bill_group,
    post_service,
    post_to_customer_balance,
    amount,
    phone_number,
    payment_channel,
    billable,
    penalty_charge,
    total_charge,
  }: ServiceApplicationI) {
    this.service_type = service_type;
    this.first_name = first_name;
    this.last_name = last_name;
    this.phone = phone;
    this.email = email;
    this.loc_coordinates = loc_coordinates;
    this.coordinates = coordinates;
    this.address = address;
    this.area = area;
    this.description = description;
    this.meter_number = meter_number;
    this.account_number = account_number;
    this.customer_id = customer_id;
    this.customer_account_id = customer_account_id;
    this.bill_group = bill_group;
    this.post_service = post_service;
    this.post_to_customer_balance = post_to_customer_balance;
    this.amount = amount || 0;
    this.phone_number = phone_number || "";
    this.payment_channel = payment_channel;
    this.billable = billable;
    this.penalty_charge = penalty_charge || 0;
    this.total_charge = total_charge || 0;
  }

  get fullname(): string {
    return `${this.first_name} ${this.last_name}`;
  }
}
