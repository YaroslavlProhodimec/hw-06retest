import { blogsCollection } from "../../db";
import {
  BlogDBType,
  BlogInputModel,
  BlogViewModel,
} from "../../dto/blogsDTO/BlogModel";
import { transformBlogsResponse } from "../../utils/blogs-utils/transformBlogsResponse";
import { ObjectId } from "mongodb";

export const blogsCommandsRepository = {
  async createNewBlog(newBlog: BlogDBType): Promise<BlogViewModel> {
    const result = await blogsCollection.insertOne(newBlog);

    return transformBlogsResponse(newBlog, result.insertedId.toString());
  },
  async updateBlogById(id: string, body: BlogInputModel): Promise<boolean> {
    const { description, name, websiteUrl } = body;
    const foundBlog = await blogsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!foundBlog) {
      return false;
    } else {
      const updatedResult = await blogsCollection.updateOne(
        { _id: foundBlog._id },
        { $set: { name, description, websiteUrl } }
      );
      return updatedResult.matchedCount === 1;
    }
  },
  async deleteBlogById(id: string): Promise<boolean> {
    const deleteResult = await blogsCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  },
};
