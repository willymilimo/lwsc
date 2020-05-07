import { DeliveryType } from "../types/delivery-type";

export interface BowserI {
  referenceId?: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  litres: number;
  deliveryType: DeliveryType;
  costPerLitre: number;
  totalPrice?: number;
}

export class Bowser implements BowserI {
  referenceId?: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  litres: number;
  deliveryType: DeliveryType;
  costPerLitre: number;

  constructor({
    referenceId,
    fullName,
    phone,
    email,
    address,
    litres,
    deliveryType,
    costPerLitre,
  }: BowserI) {
    this.referenceId = referenceId;
    this.fullName = fullName;
    this.phone = phone;
    this.email = email;
    this.address = address;
    this.litres = litres;
    this.deliveryType = deliveryType;
    this.costPerLitre = costPerLitre;
  }

  public get totalPrice(): number {
    return this.litres * this.costPerLitre;
  }
}
