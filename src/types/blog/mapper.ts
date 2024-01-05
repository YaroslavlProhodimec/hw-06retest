import {WithId} from "mongodb";
import {BlogType, OutputBlogType} from "./output";
import {OutputPostType, PostType} from "../post/output";
// import {BlogType, OutputBlogType} from "./output";

export const blogMapper = (blog:WithId<BlogType>):any => {
    return {
        id:blog._id.toString(),
        name:blog.name,
        description:blog.description,
        websiteUrl:blog.websiteUrl,
        createdAt:blog.createdAt,
        isMembership:blog.isMembership
    }
}