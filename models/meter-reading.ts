interface MeterImage {
  title: string;
  file_extension: string;
  file_name: string;
  remote_location: string;
  local_location: string;
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
}
