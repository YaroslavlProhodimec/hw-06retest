import { body } from "express-validator";

export const stringInputValidatorCommon = (field: string) => {
    return body(field)
      .exists()
      .withMessage(`${field} field is required`)
      .isString()
      .trim()
      .withMessage(`${field} should be of type String`)
      .notEmpty()
      .withMessage(`${field} must be included in request body`);
  };
  
  export const stringsInputValidatorWithLength = (
    field: string,
    maxLength: number,
    minLength?: number
  ) => {
    return stringInputValidatorCommon(field)
      .isLength({ max: maxLength })
      .withMessage(`${field}'s max length is ${maxLength}`)
      .isLength({ min: minLength })
      .withMessage(`${field}'s min length is ${minLength}`);
  };