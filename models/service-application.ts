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
  }

  get fullname(): string {
    return `${this.first_name} ${this.last_name}`;
  }
}
