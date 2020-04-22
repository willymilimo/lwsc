export interface ResponseI <T> {
    success: boolean;
    payload: T,
    message: string;
}

export type ReponseType<T> = ResponseI<T>;