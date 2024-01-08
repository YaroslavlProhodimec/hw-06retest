import { stringInputValidatorCommon } from "../common-utils/validatorForStrings";

export const authValidator = [
  stringInputValidatorCommon("loginOrEmail"),
  stringInputValidatorCommon("password"),
];
