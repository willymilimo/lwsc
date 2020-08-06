import { UploadFileI } from "./upload-file";

interface MeterImage {
  title: string;
  file_extension: string;
  file_name: string;
  remote_location: string;
  local_location: string;
}

export interface MeterReadingI {
  bill_group: string;
  current_reading: number;
  current_reading_date: string;
  current_reading_datetime: string;
  x_gps: number;
  y_gps: number;
  access_code: string;
  description_code: string;
  connection_id: string | number;
  attachements: UploadFileI[];
  staffNumber?: string;
  lineNumber: string;
}

export interface MeterReading {
  value: number;
  attachments: MeterImage[];
}

export interface BillGroupI {
  GROUP_ID: string;
  DESCRIPTION: string;
}

export interface BookNumberI {
  CODE: string;
  DESCRIBE: string;
  BILLGROUP: string;
  NO_WALKS: string;
  ASSIGNED_TO: string;
  HANDHELD_ID: string;
  STATION_ID: string;
  key: string;
}

export class BookNumber implements BookNumberI {
  CODE: string;
  DESCRIBE: string;
  BILLGROUP: string;
  NO_WALKS: string;
  ASSIGNED_TO: string;
  HANDHELD_ID: string;
  STATION_ID: string;

  constructor({
    CODE,
    DESCRIBE,
    BILLGROUP,
    NO_WALKS,
    ASSIGNED_TO,
    HANDHELD_ID,
    STATION_ID,
  }: BookNumberI) {
    this.CODE = CODE;
    this.DESCRIBE = DESCRIBE;
    this.BILLGROUP = BILLGROUP;
    this.NO_WALKS = NO_WALKS;
    this.ASSIGNED_TO = ASSIGNED_TO;
    this.HANDHELD_ID = HANDHELD_ID;
    this.STATION_ID = STATION_ID;
  }

  get key(): string {
    return `${this.BILLGROUP}`;
  }
}

export interface PropertyI {
  BILLGROUP: string;
  Township: string;
  BOOK_NO: string;
  WALK_NO: number;
  AccountNumber: string;
  lineNumber: string;
  Customer_Address: string;
  PLOT_NO: string;
  MeterNumber: string;
  PreviousReading: number;
  PreviousReadingDate: string;
  CurrentReadingDate: string;
  CurrentReading: number;
  MessagesNote: string;
  MessagesAccess: string;
  Meter_Status: string;
  key: string;
  previousReadingDate: Date;
  connection_id: string;
  displayAddress?: string;
  displayPlotAddress?: string;
  _PLOT_NO?: string;
  _Customer_Address?: string;
}

export class Property implements PropertyI {
  BILLGROUP: string;
  Township: string;
  BOOK_NO: string;
  WALK_NO: number;
  AccountNumber: string;
  lineNumber: string;
  _Customer_Address: string;
  _PLOT_NO: string;
  MeterNumber: string;
  PreviousReading: number;
  PreviousReadingDate: string;
  CurrentReadingDate: string;
  CurrentReading: number;
  MessagesNote: string;
  MessagesAccess: string;
  Meter_Status: string;
  connection_id: string;

  constructor({
    BILLGROUP,
    Township,
    BOOK_NO,
    WALK_NO,
    AccountNumber,
    lineNumber,
    Customer_Address,
    _Customer_Address,
    PLOT_NO,
    _PLOT_NO,
    MeterNumber,
    PreviousReading,
    PreviousReadingDate,
    CurrentReadingDate,
    CurrentReading,
    MessagesNote,
    MessagesAccess,
    Meter_Status,
    connection_id,
  }: PropertyI) {
    this.BILLGROUP = BILLGROUP;
    this.Township = Township;
    this.BOOK_NO = BOOK_NO;
    this.WALK_NO = WALK_NO;
    this.AccountNumber = AccountNumber;
    this.lineNumber = lineNumber;
    this._Customer_Address = _Customer_Address || Customer_Address;
    this._PLOT_NO = _PLOT_NO || PLOT_NO;
    this.MeterNumber = MeterNumber;
    this.PreviousReading = PreviousReading;
    this.PreviousReadingDate = PreviousReadingDate;
    this.CurrentReadingDate = CurrentReadingDate;
    this.CurrentReading = CurrentReading;
    this.MessagesNote = MessagesNote;
    this.MessagesAccess = MessagesAccess;
    this.Meter_Status = Meter_Status;
    this.connection_id = connection_id;
  }

  get key(): string {
    return `${this.BILLGROUP}_${this.BOOK_NO}_${this.WALK_NO}`;
  }

  get Customer_Address(): string {
    return this._Customer_Address || "";
  }

  get PLOT_NO(): string {
    return this._PLOT_NO || "";
  }

  get previousReadingDate(): Date {
    return new Date(this.PreviousReadingDate);
  }

  get displayAddress(): string {
    return `${this.PLOT_NO} ${this.Customer_Address} ${this.Township}`.trim();
  }

  get displayPlotAddress(): string {
    return `${this.PLOT_NO} ${this.Customer_Address}`.trim();
  }
}
