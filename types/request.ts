import { ResponseI } from "./response";

export interface RequestI {
  loading: boolean;
  response: ResponseI<any> | null;
}
