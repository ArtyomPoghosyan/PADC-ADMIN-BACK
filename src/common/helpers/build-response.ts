import { HttpException } from '@nestjs/common';
import { ErrorResponse, GeneralResponse } from '../models/general-response';

export function buildResponse<T>(
  success: boolean,
  data: T | ErrorResponse = null,
  status = 400,
): GeneralResponse<T> {
  const response: GeneralResponse<T> = {
    success,
  };
  if (success) {
    response.data = data as T;
    return response;
  }
  response.error = data as ErrorResponse;
  throw new HttpException(response, status);
}
