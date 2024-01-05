import {body, param} from "express-validator";
import {inputModelValidation} from "../middlewares/input-model-validation/input-model-validation";
import {BlogRepository} from "../repositories/blog-repository";
import {PostRepository} from "../repositories/post-repository";


export const titleValidation = body('content')
    // .exists()
    .isString()
    .trim()
    .isLength({
    min: 20,
    max: 300
}).withMessage('Incorrect xaxa content')
// export const postIdValidation = param('postId')
//     .optional()
//     // .isLength({ max: 30})
//     .isString()
//     .trim()
//     .notEmpty()
//     .custom( async (value)=>{
//         console.log(value,'value')
//         const post = await PostRepository.getPostById(value)
//         console.log(post,'post')
//         if (!post){
//
//             throw new Error('Post is not exists')
//         }
//
//         return true
//     })
//     .withMessage('Incorrect URL postId');
export const commentsValidation = () => [
    titleValidation,
    // postIdValidation,
    inputModelValidation
]
// export const commentsIdValidation = () => [
//     postIdValidation,
//     inputModelValidation
// ]