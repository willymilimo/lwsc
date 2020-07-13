export interface ServiceApplicationI {
  service_type: string;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  location: { latitude: number; longitude: number };
  address: string;
  description?: string;
  accountMeterNumber?: string;
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
