import {body} from "express-validator";
import {inputModelValidation} from "../middlewares/input-model-validation/input-model-validation";
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


export const confirmationCodeValidator = () =>[stringInputValidatorCommon("code"),inputModelValidation]
