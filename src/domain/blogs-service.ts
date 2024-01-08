import { ObjectId } from "mongodb";
import { BlogInputModel, BlogViewModel } from "../dto/blogsDTO/BlogModel";
import {
  CreatePostForSpecificBlogType,
  PostDBType,
  PostViewModel,
} from "../dto/postsDTO/PostModel";
import { blogsCommandsRepository } from "../repositories/commands-repository/blogsCommandsRepository";
import { creationDate } from "../utils/common-utils/creation-publication-dates";
import { blogsQueryRepository } from "../repositories/query-repository/blogsQueryRepository";
import { postsCommandsRepository } from "../repositories/commands-repository/postsCommandsRepository";

export const blogsService = {
  async createNewBlog(body: BlogInputModel): Promise<BlogViewModel> {
    const { name, description, websiteUrl } = body;
    const newBlog = {
      name,
      description,
      websiteUrl,
      createdAt: creationDate(),
      isMembership: false,
    };
    const result = await blogsCommandsRepository.createNewBlog(newBlog);
    return result;
  },
  async createNewPostForSpecificBlog(
    body: CreatePostForSpecificBlogType,
    id: string
  ): Promise<PostViewModel | null> {
    const { title, shortDescription, content } = body;
    const blog = await blogsQueryRepository.findBlogById(id);
    if (!blog) return null;
    const newPost: PostDBType = {
      title,
      shortDescription,
      content,
      blogId: new ObjectId(id),
      blogName: blog.name,
      createdAt: creationDate(),
    };
    return await postsCommandsRepository.createNewPost(newPost);
  },
  async updateBlogById(id: string, body: BlogInputModel): Promise<boolean> {
    return await blogsCommandsRepository.updateBlogById(id, body);
  },
  async deleteBlogById(id: string): Promise<boolean> {
    return await blogsCommandsRepository.deleteBlogById(id);
  },
};
