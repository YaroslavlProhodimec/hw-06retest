import {Router, Request, Response} from "express";
import {BlogRepository} from "../repositories/blog-repository";
import {blogPostValidation, idParamsValidation} from "../validators/blogs-validator";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {BlogParams, SortDataType} from "../types/blog/input";
import {HTTP_STATUSES} from "../utils/common";
import {RequestWithBodyAndParams, RequestWithQuery} from "../types/common";
import {PostRepository} from "../repositories/post-repository";
import {postValidation} from "../validators/post-validator";

type RequestTypeWithQuery<Q> = Request<{}, {}, {}, Q>

export const blogRoute = Router({})

blogRoute.get('/', async (req: RequestWithQuery<SortDataType>, res: Response) => {

    const sortData = {
        searchNameTerm: req.query.searchNameTerm,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
    }

    const blogs = await BlogRepository.getAllBlogs(sortData)
    res.status(HTTP_STATUSES.OK_200).send(blogs)
    // res.send(blogs)
})

blogRoute.get('/:id', idParamsValidation, async (req: Request, res: Response) => {

    const blog = await BlogRepository.getBlogById(req.params.id)

    if (blog) {
        res.status(HTTP_STATUSES.OK_200).json(blog)
        return;
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
})

blogRoute.get('/:id/posts',
    // idParamsValidation,
    async (req: Request, res: Response) => {

        const id = req.params.id

        const sortData = {
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection,
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize,
        }

        // pagesCount=2&page=1&pageSize=10&totalCount=12

        const posts = await BlogRepository.getPostsByBlogId(id, sortData);
        // const blog = await BlogRepository.getBlogById(id,sortData);
        // console.log(posts.,'posts')
        if (posts!.items.length < 1) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }
        res.status(HTTP_STATUSES.OK_200).send(posts)
    })


blogRoute.post('/',
    authMiddleware, blogPostValidation(),
    async (req: Request, res: Response) => {

        const blogID = await BlogRepository.createBlog(req.body)
        const newBlog = await BlogRepository.getBlogById(blogID)
        if (newBlog) {
            res.status(HTTP_STATUSES.CREATED_201).json(newBlog)
            return;
        }
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })

// blogRoute.post('/:id',
//     authMiddleware, blogPostValidation(),
//     async (req: Request, res: Response) => {
//
//         const id = req.params.id
//         const blog = await BlogService.createBlog()
//         res.send(blog)
//     })

blogRoute.post('/:id/posts',
    authMiddleware,
    // blogPostValidation(),
    postValidation(),
    async (req: RequestWithBodyAndParams<BlogParams, {
        title: string,
        shortDescription: string,
        content: string
    }>, res: Response) => {

        const id = req.params.id
        const {title, shortDescription, content} = req.body

        const blog = await BlogRepository.getBlogById(id)

        if (!blog) {
            res.send(404)
            return;
        }

        const createdPostId = await BlogRepository.createPostToBlog(id, {title, shortDescription, content})
        // const blogFound = await BlogRepository.getBlogById(id)
        if (!blog) {
            res.sendStatus(404)
        }

        const post = await PostRepository.getPostById(createdPostId)

        console.log(post, 'post')
        if (!post) {
            res.sendStatus(404)
            return;

        }
        res.status(HTTP_STATUSES.CREATED_201
        ).send(post)
    })

blogRoute.delete('/:id', authMiddleware, idParamsValidation, async (req: Request<BlogParams>, res: Response) => {
    const isDeleted = await BlogRepository.deleteBlog(req.params.id)
    if (isDeleted) res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    else res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

})
// blogRoute.delete('/',authMiddleware,idParamsValidation,async (req: Request<BlogParams>, res: Response) => {
//
//     const blogs = await BlogRepository.deleteAllBlogs()
//
//     if(!blogs){
//         res.sendStatus(404)
//     }
//     res.sendStatus(204)
// })

blogRoute.put('/:id', authMiddleware, blogPostValidation(), idParamsValidation, async (req: Request<BlogParams>, res: Response) => {
    const updateDate = req.body
    const isUpdated = await BlogRepository.updateBlog(req.params.id, updateDate)

    if (isUpdated) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return;
    }
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

})


