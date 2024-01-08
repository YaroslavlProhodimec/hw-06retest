import { validationResult } from "express-validator";
import { Request } from "express";
import { TFieldError } from "../../dto/common/ErrorResponseModel";

export const responseErrorTransformerFunction = (
  request: Request
): TFieldError[] => {
  const validationErrors = validationResult(request);
  if (!validationErrors.isEmpty()) {
    const errors: TFieldError[] = validationErrors
      .array({ onlyFirstError: true })
      .map((error) => {
        return {
          message: error.msg,
          field: error.param,
        };
      });
    return errors;
  } else {
    return [];
  }
};
