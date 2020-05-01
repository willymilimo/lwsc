export interface IResponse<Type> {
  success: boolean;
  error: { error_type: string; message: string };
  message: string;
  payload: Type;
}
