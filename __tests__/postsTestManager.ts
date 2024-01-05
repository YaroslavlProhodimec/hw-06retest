import request from "supertest";
import {app, HTTP_STATUSES, RouterPaths} from "../setting";
import {CreatePostInputModel} from "../models/posts-models/posts-models";

type HttpKeys = keyof typeof HTTP_STATUSES
type HttpStatusType = (typeof HTTP_STATUSES)[HttpKeys];

export const postsTestManager = {
    async createPost(data: CreatePostInputModel, expectedStatus: HttpStatusType) {

        const responce = await request(app)
            .post(RouterPaths.posts)
            .auth('admin', 'qwerty')
            .send(data)
            .expect(expectedStatus)

        let createdPostManager;
        if (expectedStatus === HTTP_STATUSES.CREATED_201) {
            createdPostManager = responce.body

            expect(createdPostManager).toEqual(
                {
                    id: expect.any(String),
                    title: createdPostManager.title,
                    shortDescription: createdPostManager.shortDescription,
                    content: createdPostManager.content,
                    blogId:	createdPostManager.blogId,// как проверить точно?
                    blogName: createdPostManager.blogName,
                    createdAt: createdPostManager.createdAt,
                })
        }
        return {responce, createdPostManager};

    }
}