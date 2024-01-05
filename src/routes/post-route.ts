import {Router, Request, Response} from "express";
import {PostRepository} from "../repositories/post-repository";
import {BlogParams} from "../types/blog/input";
import {postValidation} from "../validators/post-validator";
import {authMiddleware, bearerAuth} from "../middlewares/auth/auth-middleware";
import {HTTP_STATUSES} from "../utils/common";
import {commentsValidation} from "../validators/comments-validator";
import {CommentsRepository} from "../repositories/comments-repository";


export const postRoute = Router({})
// старый вариант без пагинации
// postRoute.get('/', async (req: Request, res: Response) => {
//     const posts = await PostRepository.getAllPosts()
//     res.status(HTTP_STATUSES.OK_200).json(posts)
// })
// new variants  with pagination
postRoute.get('/', async (req: Request, res: Response) => {
    const sortData = {
        searchNameTerm: req.query.searchNameTerm,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
    }

    const posts = await PostRepository.getAllPostsQueryParam(sortData)
    res.status(HTTP_STATUSES.OK_200).json(posts)
})
postRoute.get('/:id', async (req: Request<BlogParams>, res: Response) => {

    const post = await PostRepository.getPostById(req.params.id)

    if (post) {
        res.status(HTTP_STATUSES.OK_200).json(post)
        return;
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
})
postRoute.post('/', authMiddleware, postValidation(), async (req: Request, res: Response) => {
    const creatData = req.body
    const postID = await PostRepository.createPost(creatData)
    if (postID) {
        const newPost = await PostRepository.getPostById(postID)
        if (newPost) {
            res.status(HTTP_STATUSES.CREATED_201).json(newPost)
            return;
        }
    }
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})

postRoute.put('/:id', authMiddleware, postValidation(), async (req: Request<BlogParams>, res: Response) => {
    const updateData = req.body
    const isUpdated = await PostRepository.updatePost(req.params.id, updateData)
    if (isUpdated) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return;
    }
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})

postRoute.delete('/:id', authMiddleware, async (req: Request<BlogParams>, res: Response) => {

    let idDeleted = await PostRepository.deletePost(req.params.id)
    if (idDeleted) res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    else res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})


postRoute.post('/:postId/comments', bearerAuth,
    commentsValidation(),
    async (req: any, res: Response) => {
        const content = req.body.content
        const postId  = req.params.postId

        const post = await PostRepository.getPostById(postId)
        if(!post){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }
        const newComment = await CommentsRepository.createComments(content, req.user!._id,postId)

        if (newComment) {
            res.status(HTTP_STATUSES.CREATED_201).json(newComment)
            return;
        }

        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })

postRoute.get('/:postId/comments',
    // commentsValidation(),
    // commentsIdValidation(),
    async (req: any, res: Response) => {
        const sortData = {
            searchNameTerm: req.query.searchNameTerm,
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection,
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize,
        }
        const postId  = req.params.postId
        const post = await PostRepository.getPostById(postId)
        if(!post){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        const comments = await CommentsRepository.getAllCommentsQueryParam(sortData,postId)

        if (comments) {
            res.status(HTTP_STATUSES.OK_200).json(comments)
            return;
        }
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })





