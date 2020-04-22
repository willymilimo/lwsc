export interface InputItemI<T> {
  value: T;
  error: boolean;
}

export type InputItemType<T> = InputItemI<T>;