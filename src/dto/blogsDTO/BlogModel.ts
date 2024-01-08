import { ObjectId } from "mongodb";

export interface BlogDBType {
  _id?: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean; //MUST be false. True if user has not expired membership subscription to blog
}

export type BlogViewModel = {
  id?: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean; //MUST be false. True if user has not expired membership subscription to blog
};

export type BlogInputModel = {
  name: string; //required, maxLength = 15
  description: string; //required, maxLength = 500
  websiteUrl: string; //required, maxLength = 100, pattern = ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
};

export type BlogPostInputModel = {
  title: string; //required, maxLength = 30
  shortDescription: string; //required, maxLength = 100
  content: string; //required, maxLength = 1000
};
