export interface IResponse<Type> {
  success: boolean;
  error: string;
  message: string;
  payload: Type;
}
