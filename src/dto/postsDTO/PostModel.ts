import { ObjectId } from "mongodb";

export type PostDBType = {
  _id?: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
  blogName: string;
  createdAt: string;
};

export type PostViewModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type PostInputModel = {
  title: string; //required, maxLength = 30
  shortDescription: string; //required, maxLength = 100
  content: string; //required, maxLength = 1000
  blogId: string; //required
};

export type CreatePostForSpecificBlogType = Omit<PostInputModel, "blogId">;