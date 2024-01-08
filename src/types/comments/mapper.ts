// import {WithId} from "mongodb";
// id: post._id.toString(),
//     title: post.title,
//     shortDescription: post.shortDescription,
//     content: post.content,
//     blogId: post.blogId,
//     blogName: post.blogName,
//     createdAt: post.createdAt
export const commentsMapper = (comment: any): any => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin,
        },
        createdAt: comment.createdAt,
    }
// {
//     "id": "string",
//     "content": "string",
//     "commentatorInfo": {
//     "userId": "string",
//         "userLogin": "string"
// },
//     "createdAt": "2024-01-04T09:35:46.339Z"
}