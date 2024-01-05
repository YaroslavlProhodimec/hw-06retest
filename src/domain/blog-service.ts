// import {BlogRepository} from "../repositories/blog-repository";
//
// export class BlogService {
//     static async createBlog(id: string) {
//         const blog = await BlogRepository.getBlogById(id)
//         if (!blog) {
//             res.sendStatus(404)
//         }
//     }
//
//     static async createPostToBlog(blogId: string,postData:{
//         title: string,
//         shortDescription: string,
//         content: string
//     }) {
//
//         const blog = await BlogRepository.getBlogById(blogId)
//
//         if (!blog) {
//             res.sendStatus(404)
//         }
//
//     }
//
// }