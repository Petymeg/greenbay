import { ApiErrorModel } from '../models/common/ApiErrorModel';

function generalError(status: number): (message: string) => ApiErrorModel {
  return function (message: string): ApiErrorModel {
    return {
      status: status,
      message: message,
    };
  };
}

export const badRequestError = generalError(400);
export const unauthorizedError = generalError(401);
export const forbiddenError = generalError(403);
export const notFoundError = generalError(404);
export const conflictError = generalError(409);
