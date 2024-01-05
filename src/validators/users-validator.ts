import {body} from "express-validator";
import {inputModelValidation} from "../middlewares/input-model-validation/input-model-validation";

const loginValidation = body('login')
    .isString()
    .trim()
    .isLength({min: 3, max: 10})
    .withMessage('Invalid login')
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage('Invalid login')
const passwordValidation = body('password')
    .isString()
    .trim()
    .isLength({min: 6, max: 20})
    .withMessage('Invalid password')
const emailValidation = body('email')
    .isString()
    .trim()
    .withMessage('Invalid email')
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage('Invalid email')


export const userValidation = () => [loginValidation,passwordValidation,emailValidation,inputModelValidation]
