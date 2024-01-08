import {
  PostDBType,
  PostInputModel,
  PostViewModel,
} from "../dto/postsDTO/PostModel";
import { creationDate } from "../utils/common-utils/creation-publication-dates";
import { ObjectId } from "mongodb";
import { postsCommandsRepository } from "../repositories/commands-repository/postsCommandsRepository";
import { blogsQueryRepository } from "../repositories/query-repository/blogsQueryRepository";
import { commentsCommandsRepository } from "../repositories/commands-repository/commentsCommandsRepository";
import {
  CommentDBType,
  CommentViewModel,
} from "../dto/commentsDTO/commentsDTO";
import { postsCollection } from "../db";
import { usersCommandsRepository } from "../repositories/commands-repository/usersCommandsRepository";

export const postsService = {
  async _findPostById(id: string): Promise<PostDBType | null> {
    const foundPost = await postsCollection.findOne({ _id: new ObjectId(id) });
    return foundPost;
  },
  async createNewPost(body: PostInputModel): Promise<PostViewModel | null> {
    const { title, shortDescription, content, blogId } = body;
    const blog = await blogsQueryRepository.findBlogById(blogId);
    if (!blog) {
      return null;
    }
    const newPost: PostDBType = {
      title,
      shortDescription,
      content,
      blogId: new ObjectId(blogId),
      blogName: blog!.name,
      createdAt: creationDate(),
    };
    return await postsCommandsRepository.createNewPost(newPost);
  },
  async updatePostById(id: string, body: PostInputModel): Promise<boolean> {
    return await postsCommandsRepository.updatePostById(id, body);
  },
  async deletePostById(id: string): Promise<boolean> {
    return await postsCommandsRepository.deletePostById(id);
  },
  async createNewComment(
    postId: string,
    content: string,
    userId: string
  ): Promise<CommentViewModel | null> {
    const foundPost = await this._findPostById(postId);
    if (!foundPost) {
      return null;
    }
    const foundUser = await usersCommandsRepository.findUserById(userId);
    const newComment: CommentDBType = {
      postId,
      content,
      createdAt: creationDate(),
      commentatorInfo: {
        userId,
        userLogin: foundUser!.accountData.login,
      },
    };
    return commentsCommandsRepository.createComment(newComment);
  },
};
