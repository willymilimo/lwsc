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
}
