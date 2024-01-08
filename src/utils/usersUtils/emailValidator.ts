import { userEmailRegex } from "../common-utils/regexes";
import { stringInputValidatorCommon } from "../common-utils/validatorForStrings";

export const emailValidator = [
  stringInputValidatorCommon("email")
    .matches(userEmailRegex)
    .withMessage(
      `Email doesn't match this regular expression: ${userEmailRegex}`
    ),
];