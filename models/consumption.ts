export interface ConsumptionI {
  custkey: string;
  BILNG_DATE: string;
  DESCRIPTION: string;
  TRNS_TYPE: number;
  TRNS_STYPE: number;
  DATE_FROM: string;
  DATE_TO: string;
  PR_READING: number;
  CR_READING: number;
  CONSUMP: number;
  AMOUNT: number;
  BILL_CYCLE_ID: number;
  [""]: string;
  billingDate: Date;
  dateFrom: Date;
  dateTo: Date;
}

export class Consumption implements ConsumptionI {
  custkey: string;
  BILNG_DATE: string;
  DESCRIPTION: string;
  TRNS_TYPE: number;
  TRNS_STYPE: number;
  DATE_FROM: string;
  DATE_TO: string;
  PR_READING: number;
  CR_READING: number;
  CONSUMP: number;
  AMOUNT: number;
  BILL_CYCLE_ID: number;
  [""]: string;

  constructor(item: ConsumptionI) {
    const {
      custkey,
      BILNG_DATE,
      DESCRIPTION,
      TRNS_TYPE,
      TRNS_STYPE,
      DATE_FROM,
      DATE_TO,
      PR_READING,
      CR_READING,
      CONSUMP,
      AMOUNT,
      BILL_CYCLE_ID,
    } = item;

    this.custkey = custkey;
    this.BILNG_DATE = BILNG_DATE;
    this.DESCRIPTION = DESCRIPTION;
    this.TRNS_TYPE = TRNS_TYPE;
    this.TRNS_STYPE = TRNS_STYPE;
    this.DATE_FROM = DATE_FROM;
    this.DATE_TO = DATE_TO;
    this.PR_READING = PR_READING;
    this.CR_READING = CR_READING;
    this.CONSUMP = CONSUMP;
    this.AMOUNT = AMOUNT;
    this.BILL_CYCLE_ID = BILL_CYCLE_ID;
    this[""] = item[""];
  }

  get billingDate(): Date {
    return new Date(this.BILNG_DATE);
  }

  get dateFrom(): Date {
    return new Date(this.DATE_FROM || "");
  }

  get dateTo(): Date {
    return new Date(this.DATE_TO || "");
  }
}
