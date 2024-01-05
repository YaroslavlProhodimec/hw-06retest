import {body, param} from 'express-validator';
import {inputModelValidation} from "../middlewares/input-model-validation/input-model-validation";

export const idParamsValidation = param('id').exists().withMessage('Incorrect id')

export const nameValidation = body('name').isString().trim().isLength({min: 1, max: 15}).withMessage('Incorrect name')

export const descriptionValidation = body('description').isString().trim().isLength({
    min: 1,
    max: 500
}).withMessage('Incorrect description')

export const websiteUrlValidation = body('websiteUrl')
    .isString().trim()
    .isLength({min: 1, max: 100}).withMessage('Incorrect websiteUrl')
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
    .withMessage('Incorrect URL format');


export const blogPostValidation = () => [nameValidation, descriptionValidation, websiteUrlValidation, inputModelValidation]