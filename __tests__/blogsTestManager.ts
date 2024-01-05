import request from "supertest";
import {app, HTTP_STATUSES, RouterPaths} from "../setting";
import {CreateBlogInputModel} from "../models/blogs-models/blog-models";

type HttpKeys = keyof typeof HTTP_STATUSES
type HttpStatusType = (typeof HTTP_STATUSES)[HttpKeys];

export const blogsTestManager = {
    async createBlog(data: CreateBlogInputModel, expectedStatus: HttpStatusType) {

        const responce = await request(app)
            .post(RouterPaths.blogs)
            .auth('admin', 'qwerty')
            .send(data)
            .expect(expectedStatus)

        let createdBlogManager;
        if (expectedStatus === HTTP_STATUSES.CREATED_201) {
            createdBlogManager = responce.body

            expect(createdBlogManager).toEqual(
            {
                id: expect.any(String),
                name: createdBlogManager.name,
                description: createdBlogManager.description,
                websiteUrl: createdBlogManager.websiteUrl,
                createdAt: createdBlogManager.createdAt,
                isMembership: createdBlogManager.isMembership
            })
        }
        return {responce, createdBlogManager};

    }
}