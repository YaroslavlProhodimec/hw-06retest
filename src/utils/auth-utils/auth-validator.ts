import {stringInputValidatorCommon} from "../../validators/code-validator";
import {inputModelValidation} from "../../middlewares/input-model-validation/input-model-validation";

export const authValidator=() => [
  stringInputValidatorCommon("loginOrEmail"),
  stringInputValidatorCommon("password"),
    inputModelValidation
];
