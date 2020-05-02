import { AddType } from "../types/add-type";

export interface AccountI {
  ACCOUNT_NO?: string | number;
  METER_NO?: string | number;
  CUSTKEY: string;
  CUSTOMER_ID: number;
  BOOK_NO: string;
  WALK_NO: number;
  SEQ_NO: number;
  ID_NO: string;
  UA_ADRESS1: string;
  UA_ADRESS2: string;
  UA_ADRESS3: string;
  INITIAL: string;
  SURNAME: string;
  CONSUMER_TYPE: string;
  BILLGROUP: string;
  IS_METERED: boolean;
}

export class Account implements AccountI {
  ACCOUNT_NO?: string | number;
  METER_NO?: string | number;
  CUSTKEY: string;
  CUSTOMER_ID: number;
  BOOK_NO: string;
  WALK_NO: number;
  SEQ_NO: number;
  ID_NO: string;
  UA_ADRESS1: string;
  UA_ADRESS2: string;
  UA_ADRESS3: string;
  INITIAL: string;
  SURNAME: string;
  CONSUMER_TYPE: string;
  BILLGROUP: string;
  IS_METERED: boolean;

  constructor({
    ACCOUNT_NO,
    METER_NO,
    CUSTKEY,
    CUSTOMER_ID,
    BOOK_NO,
    WALK_NO,
    SEQ_NO,
    ID_NO,
    UA_ADRESS1,
    UA_ADRESS2,
    UA_ADRESS3,
    INITIAL,
    SURNAME,
    CONSUMER_TYPE,
    BILLGROUP,
    IS_METERED,
  }: AccountI) {
    this.ACCOUNT_NO = ACCOUNT_NO;
    this.METER_NO = METER_NO;
    this.CUSTKEY = CUSTKEY;
    this.CUSTOMER_ID = CUSTOMER_ID;
    this.BOOK_NO = BOOK_NO;
    this.WALK_NO = WALK_NO;
    this.SEQ_NO = SEQ_NO;
    this.ID_NO = ID_NO;
    this.UA_ADRESS1 = UA_ADRESS1;
    this.UA_ADRESS2 = UA_ADRESS2;
    this.UA_ADRESS3 = UA_ADRESS3;
    this.INITIAL = INITIAL;
    this.SURNAME = SURNAME;
    this.CONSUMER_TYPE = CONSUMER_TYPE;
    this.BILLGROUP = BILLGROUP;
    this.IS_METERED =
      typeof IS_METERED == "boolean" ? IS_METERED : IS_METERED == AddType.meter;
  }
}
