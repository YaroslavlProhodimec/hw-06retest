import {
  PostDBType,
  PostInputModel,
  PostViewModel,
} from "../../dto/postsDTO/PostModel";
import { blogsCollection, postsCollection } from "../../db";
import { transformPostsResponse } from "../../utils/posts-utils/transformPostsResponse";
import { ObjectId } from "mongodb";

export const postsCommandsRepository = {
  async createNewPost(newPost: PostDBType): Promise<PostViewModel> {
    const result = await postsCollection.insertOne(newPost);
    return transformPostsResponse(newPost, result.insertedId.toString());
  },
  async updatePostById(id: string, body: PostInputModel): Promise<boolean> {
    const { blogId, content, shortDescription, title } = body;
    const foundPostById = await postsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!foundPostById) {
      return false;
    } else {
      const blog = await blogsCollection.findOne({ _id: new ObjectId(blogId) });
      const updatedResult = await postsCollection.updateOne(
        { _id: foundPostById._id },
        {
          $set: {
            blogId: new ObjectId(blogId),
            content,
            shortDescription,
            title,
            blogName: blog?.name,
          },
        }
      );
      return updatedResult.matchedCount === 1;
    }
  },
  async deletePostById(id: string): Promise<boolean> {
    const deleteResult = await postsCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  },
};
