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
  customer_id: String;
  customer_account_id: String;
  bill_group?: string;
}

// export class ServiceApplication implements ServiceApplicationI {
//   service_type: string;
//   first_name: string;
//   last_names: string;
//   phone: string;
//   email?: string | undefined;
//   location: { latitude: number; longitude: number };
//   address: string;
//   description?: string | undefined;
//   accountMeterNumber?: string | undefined;

// }
