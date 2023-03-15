export interface GeneralResponse<T = null> {
  success: boolean;
  data?: T;
  error?: ErrorResponse;
}

export interface IErrorResponseItem {
  key: string;
  message: string;
}

export interface ErrorResponse {
  message: string[] | IErrorResponseItem[];
}
