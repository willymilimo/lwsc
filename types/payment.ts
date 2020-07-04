export enum PaymentType {
  AIRTEL_MONEY = "Airtel Money",
  "Airtel Money" = "AIRTEL_MONEY",

  MTN_MONEY = "MTN Money",
  "MTN Money" = "MTN_MONEY",

  ZAMTEL_KWACHA = "Zampay",
  Zampay = "ZAMTEL_KWACHA",

  "VISA/MasterCard" = "Debit/ATM Card",
  "Debit/ATM Card" = "VISA/MasterCard"
}

export type PaymentT = PaymentType;
