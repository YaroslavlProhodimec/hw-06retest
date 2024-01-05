import {body} from "express-validator";
import {inputModelValidation} from "../middlewares/input-model-validation/input-model-validation";

const loginOrEmailValidation = body('loginOrEmail')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Invalid loginOrEmail')

const passwordValidation = body('password')
    .isString()
    .trim()
    .isLength({min:6,max:20})
    .withMessage('Invalid password')


export const authLoginValidation = () => [loginOrEmailValidation, passwordValidation,inputModelValidation]