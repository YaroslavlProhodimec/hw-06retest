import request from "supertest";
import {app, HTTP_STATUSES, RouterPaths} from "../setting";
import {CreatePostInputModel, UpdatePostModel} from "../models/posts-models/posts-models";
import {postsTestManager} from "./postsTestManager";
import {CreateBlogInputModel} from "../models/blogs-models/blog-models";
import {blogsTestManager} from "./blogsTestManager";

describe('test for /posts', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    it('should return 200 and empty array', async () => {
        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: [] })
    });

    it('should return 404 for not existing post', async () => {
        await request(app)
            .get(`${RouterPaths.posts}/123`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    });

    it(`shouldn't create post with incorrect input data`, async () => {
        const data: CreatePostInputModel = {
            title: "string",
            shortDescription: "string",
            content: "",
            blogId: "string",
        }

        await postsTestManager.createPost(data, HTTP_STATUSES.BAD_REQUEST_400)


        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    });

    let createdPost: any = null;
    it('should create post with correct input data', async () => {
        const blogExist: CreateBlogInputModel = {
            name: 'Title name',
            description: 'description test',
            websiteUrl: 'https://website.com'
        }
        const {createdBlogManager} = await blogsTestManager.createBlog(blogExist, HTTP_STATUSES.CREATED_201)

        const data: CreatePostInputModel = {
            title: "string",
            shortDescription: "string",
            content: "string",
            blogId: createdBlogManager.id,
        }

        const {createdPostManager} = await postsTestManager.createPost(data, HTTP_STATUSES.CREATED_201)
        createdPost = createdPostManager

        const res = await request(app)
            .get(RouterPaths.posts)
            expect(res.body).toEqual({
                pagesCount: expect.any(Number),
                page: expect.any(Number),
                pageSize: expect.any(Number),
                totalCount: expect.any(Number),
                items: [createdPost]})


    });

    it(`shouldn't update post with incorrect input data`, async () => {
        const data: UpdatePostModel = {
            title: "",
            shortDescription: "string",
            content: "string",
            blogId: "",
        }

        await request(app)
            .put(`${RouterPaths.blogs}/${createdPost.id}`)
            .auth('admin', 'qwerty')
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)


        // await request(app)
        //     .get(`${RouterPaths.blogs}/${createdPost.Id}`)
        //     .expect(HTTP_STATUSES.OK_200, createdPost)

    });

        it('shouldnt update blog that not exist', async () => {
            const data: UpdatePostModel = {
                title: "string",
                shortDescription: "string",
                content: "string",
                blogId: "string",
            }

            await request(app)
                .put(`${RouterPaths.posts}/-1`)
                .auth('admin', 'qwerty')
                .send(data)
                .expect(HTTP_STATUSES.NOT_FOUND_404)
        });

        it(`shouldn update blog with correct input data`, async () => {
            const data: UpdatePostModel = {
                title: "string",
                shortDescription: "string",
                content: "string",
                blogId: createdPost.blogId,
            }

            // await request(app)
            //     .put(`${RouterPaths.posts}/${createdPost.id}`)
            //     .auth('admin', 'qwerty')
            //     .send(data)
            //     .expect(HTTP_STATUSES.OK_200)


            await request(app)
                .get(`${RouterPaths.posts}/${createdPost.id}`)
                .expect(HTTP_STATUSES.OK_200, {
                    ...createdPost,
                    title: data.title,
                    shortDescription: data.shortDescription,
                    content: data.content,
                    blogId: data.blogId,
                })

        });

        it('should delete both post', async () => {
            await request(app)
                .delete(`${RouterPaths.posts}/${createdPost.id}`)
                .auth('admin', 'qwerty')
                .expect(HTTP_STATUSES.NO_CONTENT_204)

            await request(app)
                .delete(`${RouterPaths.posts}/${createdPost.id}`)
                .auth('admin', 'qwerty')
                .expect(HTTP_STATUSES.NOT_FOUND_404)

            await request(app)
                .get(RouterPaths.posts)
                .expect(HTTP_STATUSES.OK_200,  {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })


        })

    afterAll(done => {
        done()
    })
})
