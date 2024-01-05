// import {body} from "express-validator";
// import {BlogRepository} from "../repositories/blog-repository";
// import {inputModelValidation} from "../middlewares/input-model-validation/input-model-validation";
//
// // export const blogIdValidation = body('blogId').isString().trim().custom((value) => {
// //     const blog = BlogRepository.getBlogsById(value)
// //
// //     if (!blog) {
// //         throw new Error('Incorrect blogId')
// //     }
// //     return true
// //
// // }).withMessage('Incorrect blogId')
//
// export const idValidation = body('id').isString().trim().withMessage('Incorrect id')
//
// export const titleValidation = body('title').isString().trim().isLength({min: 1, max: 10}).withMessage('Incorrect title')
//
//
// export const shortDescriptionValidation = body('shortDescription')
//     .isString().trim()
//     .withMessage('Incorrect URL shortDescription');
// export const contentValidation = body('content')
//     .isString().trim()
//     .withMessage('Incorrect URL content');
// export const blogIdValidation = body('blogId')
//     .isString().trim()
//     .withMessage('Incorrect URL blogId');
// export const blogNameValidation = body('blogName')
//     .isString().trim()
//     .withMessage('Incorrect URL blogName');
//
//
// export const postValidation = () => [idValidation, titleValidation, shortDescriptionValidation, contentValidation,blogIdValidation,blogNameValidation,inputModelValidation]


import {body, param} from 'express-validator';
import {inputModelValidation} from "../middlewares/input-model-validation/input-model-validation";
import {BlogRepository} from "../repositories/blog-repository";

export const idValidation = body('id')
    .optional()
    .isString().trim()
    // .isLength({
    // min: 1,
    // max: 15
    // })
    .withMessage('Incorrect id')

export const titleValidation = body('title').exists().isString().trim().isLength({
    min: 1,
    max: 30
}).withMessage('Incorrect title')

export const shortDescriptionValidation = body('shortDescription').exists()
    .isString().trim()
    .isLength({min:1,max: 100})
    .withMessage('Incorrect URL shortDescription');

export const contentValidation = body('content')
    .exists()
    .isString().trim()
    .isLength({min: 1, max: 1000})
    .withMessage('Incorrect URL content');

export const blogIdValidation = body('blogId')
    .optional()
    // .isLength({ max: 30})
    .isString()
    .trim()
    .notEmpty()
    .custom( async (value)=>{
        console.log(value,'value')
        const blog = await BlogRepository.getBlogById(value)
        console.log(blog,'blog')
        if (!blog){
            throw new Error('Blog is not exists')
        }
        return true
    })
    .withMessage('Incorrect URL blogId');
// export const blogIdParamValidation = param('blogId')
//     .optional()
//     .isLength({ max: 30})
//     .isString().trim()
//     .withMessage('Incorrect URL blogId');

export const blogNameValidation = body('blogName')
    // .exists()
    .optional()
    .isString().trim()
    .withMessage('Incorrect URL blogName');

export const postValidation = () => [
    idValidation,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    blogNameValidation,
    inputModelValidation
]