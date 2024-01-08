import {Response, Router} from "express";
import {CommentsRepository} from "../repositories/comments-repository";
import {HTTP_STATUSES} from "../utils/common";
import {bearerAuth} from "../middlewares/auth/auth-middleware";
import {commentsValidation} from "../validators/comments-validator";
import {forbiddenResponseMiddleware} from "../middlewares/forbiddenResponseMiddleware";
import {validateObjectIdMiddleware} from "../middlewares/validateObjectIdMiddleware";
import {StatusCodes} from "http-status-codes";
import {commentsService} from "../domain/comments-service";
import {accessTokenValidityMiddleware} from "../middlewares/accessTokenValidityMiddleware";
import {responseErrorValidationMiddleware} from "../middlewares/responseErrorValidationMiddleware";
import {commentValidator} from "../utils/comments-utils/commentValidator";
import {deleteComment, updateComment} from "../controllers/commentsController";


export const commentsRoute = Router({})

commentsRoute.get('/:id',

    async (req: any, res: Response) => {

        const comment = await CommentsRepository.getCommentById(req.params.id)

        if (comment) {
            res.status(HTTP_STATUSES.OK_200).json(comment)
            return;
        }
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })
//
// commentsRoute.put('/:id',
//     bearerAuth,
//     validateObjectIdMiddleware,
//     forbiddenResponseMiddleware,
//     commentsValidation(),
//
//     async (req: any, res: Response) => {
//         const {content} = req.body;
//         console.log(content,'content')
//         const updatedComment = await commentsService.updateCommentById(
//             req.params.id,
//             content
//         );
//         if (!updatedComment) {
//             res.sendStatus(StatusCodes.NOT_FOUND);
//         } else {
//             res.sendStatus(StatusCodes.NO_CONTENT);
//         }
//     })
commentsRoute.put(
    "/:id",
    accessTokenValidityMiddleware,
    validateObjectIdMiddleware,
    forbiddenResponseMiddleware,
    commentValidator,
    responseErrorValidationMiddleware,
    updateComment
);
commentsRoute.delete(
    "/:id",
    accessTokenValidityMiddleware,
    validateObjectIdMiddleware,
    forbiddenResponseMiddleware,
    deleteComment
);
//
// commentsRoute.delete('/:id',
//     bearerAuth,
//     validateObjectIdMiddleware,
//     forbiddenResponseMiddleware,
//     async (req: any, res: Response) => {
//         const deletedComment = commentsService.deleteCommentById(req.params.id);
//         if (!deletedComment) {
//             res.sendStatus(StatusCodes.NOT_FOUND);
//         } else {
//             res.sendStatus(StatusCodes.NO_CONTENT);
//         }
//     })
//
//
//
//
//
