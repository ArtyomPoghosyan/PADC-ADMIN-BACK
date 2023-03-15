import { buildResponse } from '@common/helpers/build-response';
import { isArray } from 'lodash';
import { ERROR_MESSAGES } from '@common/constants';

/**
 * @description Handles axios error
 * @param error
 * @param customMessage
 */
export function axiosErrorHandler(
  error: any,
  customMessage?: string | string[],
): any {
  if (error.response && error.response.status) {
    if (error.response.status >= 500) {
      return buildResponse(false, {
        message: [ERROR_MESSAGES.SOMETHING_WRONG],
      });
    }
    return buildResponse(
      false,
      {
        message: [
          error.response.data.error
            ? error.response.data.error?.message
            : error.response.statusText ||
              error.response.data?.description ||
              ERROR_MESSAGES.SOMETHING_WRONG,
        ],
      },
      error.response.status,
    );
  }
  return buildResponse(false, {
    message: customMessage
      ? isArray(customMessage)
        ? customMessage
        : [customMessage]
      : [ERROR_MESSAGES.NOT_FOUND],
  });
}
