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
