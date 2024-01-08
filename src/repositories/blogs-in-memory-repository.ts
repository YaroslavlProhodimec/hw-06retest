import { creationDate } from "./../utils/common-utils/creation-publication-dates";
import { BlogInputModel, BlogViewModel } from "../dto/blogsDTO/BlogModel";
import { db } from "../temporal-database/project-db";
import { randomUUID } from "crypto";

export const blogsList = db.blogs;

export const blogsRepository = {
  async getListOfBlogs(): Promise<BlogViewModel[]> {
    return blogsList;
  },
  async findBlogById(id: string): Promise<BlogViewModel | undefined> {
    const foundBlogById = db.blogs.find((element) => element.id === id);
    return foundBlogById;
  },
  async createNewBlog(body: BlogInputModel): Promise<BlogViewModel> {
    const { name, description, websiteUrl } = body;

    const newBlog: BlogViewModel = {
      id: randomUUID(),
      name,
      description,
      websiteUrl,
      createdAt: creationDate(),
      isMembership: false,
    };
    db.blogs.push(newBlog);
    return newBlog;
  },
  async updateBlogById(id: string, body: BlogInputModel): Promise<boolean> {
    const { description, name, websiteUrl } = body;
    const foundBlog = db.blogs.find((blog) => blog.id === id);
    if (!foundBlog) {
      return false;
    } else {
      foundBlog.name = name;
      foundBlog.description = description;
      foundBlog.websiteUrl = websiteUrl;
      return true;
    }
  },
  async deleteBlogById(id: string): Promise<boolean> {
    for (let i = 0; i < db.blogs.length; i++) {
      if (db.blogs[i].id === id) {
        db.blogs.splice(i, 1);
        return true;
      }
    }
    return false;
  },
};
