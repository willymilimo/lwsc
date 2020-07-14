export interface PrepaidI {
  meterNumber: string;
}

export class Prepaid implements PrepaidI {
  meterNumber: string;

  constructor({meterNumber}: PrepaidI) {
    this.meterNumber = meterNumber;
  }
}