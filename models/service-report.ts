import { UploadFileI } from "./upload-file";
import { LocationI } from "./location";

export interface ServiceReportI {
  first_name: String;
  last_name: String;
  phone: String;
  email?: String;
  area: String;
  address: String;
  coordinates: LocationI;
  meter_number?: String;
  account_number?: String;
  description?: String;
  files: UploadFileI[];
}

export class ServiceReport implements ServiceReportI {
  first_name: String;
  last_name: String;
  phone: String;
  email?: String;
  area: String;
  address: String;
  coordinates: LocationI;
  meter_number?: String;
  account_number?: String;
  description?: String;
  files: UploadFileI[];

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
  }
}
