import { stringsInputValidatorWithLength } from "../common-utils/validatorForStrings";

export const commentValidator = [
  stringsInputValidatorWithLength("content", 300, 20),
];
