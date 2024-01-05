import {Response, Router} from "express";
import {CommentsRepository} from "../repositories/comments-repository";
import {HTTP_STATUSES} from "../utils/common";
import {bearerAuth} from "../middlewares/auth/auth-middleware";
import {commentsValidation} from "../validators/comments-validator";
import {commentsCollection} from "../index";
import {ObjectId} from "mongodb";


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

commentsRoute.put('/:id',
    bearerAuth,
    commentsValidation(),
    async (req: any, res: Response) => {

        const content = req.body.content
        const user = req.user
        const id = req.params.id
        const comment: any = await CommentsRepository.getCommentById(id)
        console.log(comment,'comment')
        // if (!comment) {
        //     res.sendStatus(404)
        //     return;
        // }

        if (comment.commentatorInfo.userId.toString() !== user._id.toString()) {
            res.sendStatus(403)
            return;
        }

        const isUpdated = await CommentsRepository.updateComment(id, content,)
        console.log(isUpdated,'isUpdated')
        if (isUpdated) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            return;
        }
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })

commentsRoute.delete('/:id',
    bearerAuth,
    async (req: any, res: Response) => {
        const user = req.user
        const id = req.params.id
        const comment: any = await commentsCollection.findOne({id:
                // new ObjectId(
                    id
                // )
        })

        // if (!comment) {
        //     res.sendStatus(404)
        //     return;
        // }

        if (comment.commentatorInfo.userId.toString() !== user._id.toString()) {
            res.sendStatus(403)
            return;
        }
        let idDeleted = await CommentsRepository.deleteComment(req.params.id)

        if (idDeleted) res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        else res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })





