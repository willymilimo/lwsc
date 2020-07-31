export interface PayPointI {
  name: string;
  latitude: number;
  longitude: number;
}

export class PayPoint implements PayPointI {
  name: string;
  latitude: number;
  longitude: number;

  constructor({ name, latitude, longitude }: PayPointI) {
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}

export interface PaypointI {
  _id: string;
  bill_group: {
    active: boolean;
    _id: string;
    title: string;
    external_id: string;
    description: string;
    created_on: string;
  };
  title: string;
  description: string;
  coordinates: {
    _id: string;
    longitude: string;
    latitude: string;
  };
  __v: 0;
}
