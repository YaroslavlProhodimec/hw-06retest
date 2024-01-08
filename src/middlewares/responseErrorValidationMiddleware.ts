import { NextFunction, Request, Response } from "express";
import { TFieldError } from "../dto/common/ErrorResponseModel";
import { responseErrorTransformerFunction } from "../utils/common-utils/responseErrorTransformerUtil";
import { responseErrorFunction } from "../utils/common-utils/responseErrorFunction";
import { StatusCodes } from "http-status-codes";

export const responseErrorValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors: TFieldError[] = responseErrorTransformerFunction(req);
  if (errors.length > 0) {
    res.status(StatusCodes.BAD_REQUEST).send(responseErrorFunction(errors));
  } else {
    next();
  }
};
