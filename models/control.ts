export interface ControlI {
  value: string | number;
  error: boolean;
}

export interface ControlIT<T> {
  value: T;
  error: boolean;
}
