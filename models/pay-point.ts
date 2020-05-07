export interface PayPointI {
    name: string;
    latitude: number;
    longitude: number;
}

export class PayPoint implements PayPointI {
    name: string;
    latitude: number;
    longitude: number;
    
    constructor({name, latitude, longitude}: PayPointI) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}