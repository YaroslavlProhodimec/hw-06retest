import {WithId} from "mongodb";
import {OutputPostType, PostType} from "../post/output";

export const postMapper = (post: any): any => {
    console.log(post.createdAt)

    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
        // .
        // toISOString()
    }
}
// Object {
//     -   "blogId": Any<String>,
//         +   "blogId": null,
//         "blogName": Any<String>,
//         "content": Any<String>,
//         -   "createdAt": StringMatching /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,
//     "id": Any<String>,
//         "shortDescription": Any<String>,
//         "title": Any<String>,
// }