export interface IResponse<Type> {
  success: boolean;
  error: { error_type: string; message: string } | string;
  message: string;
  payload: Type;
}
