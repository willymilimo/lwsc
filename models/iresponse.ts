export interface IResponse<Type = any> {
  success: boolean;
  error: string;
  message: string;
  payload: Type;
}
