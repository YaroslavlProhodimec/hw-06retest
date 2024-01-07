import { userEmailRegex } from "../common-utils/regexes";
import {stringInputValidatorCommon} from "../../validators/code-validator";
import {inputModelValidation} from "../../middlewares/input-model-validation/input-model-validation";
import {body} from "express-validator";

export const emailValidator = [
  stringInputValidatorCommon("email")
    .matches(userEmailRegex)
    .withMessage(
      `Email doesn't match this regular expression: ${userEmailRegex}`
    ),
];
const emailVal = body('email')
    .isString()
    .trim()
    .withMessage('Invalid email')
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage('Invalid email')


export const emailValidation = () => [emailVal,inputModelValidation]
