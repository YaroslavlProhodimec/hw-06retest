// import { userEmailRegex, userLoginRegex } from "../common-utils/regexes";
// import {
//   stringInputValidatorCommon,
//   stringsInputValidatorWithLength,
// } from "./../common-utils/validatorForStrings";
//
// export const createUserValidator = [
//   stringsInputValidatorWithLength("login", 10, 3)
//     .matches(userLoginRegex)
//     .withMessage(
//       `Login doesn't match this regular expression: ${userLoginRegex}`
//     ),
//   stringsInputValidatorWithLength("password", 20, 6),
//   stringInputValidatorCommon("email")
//     .matches(userEmailRegex)
//     .withMessage(
//       `Email doesn't match this regular expression: ${userEmailRegex}`
//     ),
// ];
