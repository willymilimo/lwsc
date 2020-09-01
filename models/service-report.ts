import { UploadFileI } from "./upload-file";
import { LocationI } from "./location";

export interface ServiceReportI {
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  area: string;
  address: string;
  coordinates: LocationI;
  meter_number?: string;
  account_number?: string;
  description?: string;
  files: UploadFileI[];
  bill_group?: string;
  leakage_types?: string[];
}

export class ServiceReport implements ServiceReportI {
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  area: string;
  address: string;
  coordinates: LocationI;
  meter_number?: string;
  account_number?: string;
  description?: string;
  files: UploadFileI[];
  bill_group?: string;
  leakage_types?: string[];

  constructor({
    first_name,
    last_name,
    phone,
    email,
    area,
    address,
    coordinates,
    meter_number,
    account_number,
    description,
    files,
    bill_group,
    leakage_types,
  }: ServiceReportI) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.phone = phone;
    this.email = email;
    this.area = area;
    this.address = address;
    this.coordinates = coordinates;
    this.meter_number = meter_number;
    this.account_number = account_number;
    this.description = description;
    this.files = files;
    this.bill_group = bill_group;
    this.leakage_types = leakage_types;
  }
}
