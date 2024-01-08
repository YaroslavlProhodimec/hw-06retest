import { randomUUID } from "crypto";
import { PostInputModel, PostViewModel } from "../dto/postsDTO/PostModel";
import { db } from "../temporal-database/project-db";
import { creationDate } from "../utils/common-utils/creation-publication-dates";

export const postsList = db.posts;

export const postsRepository = {
  async getListOfPosts(): Promise<PostViewModel[]> {
    return postsList;
  },
  async findPostById(id: string): Promise<PostViewModel | undefined> {
    const foundPostById = db.posts.find((element) => element.id === id);
    return foundPostById;
  },
  async createNewPost(
    body: PostInputModel
  ): Promise<PostViewModel | undefined> {
    const { title, shortDescription, content, blogId } = body;
    const blog = db.blogs.find((blog) => blog.id === blogId);
    const newPost: PostViewModel = {
      id: randomUUID(),
      title,
      shortDescription,
      content,
      blogId,
      blogName: blog!.name,
      createdAt: creationDate(),
    };
    db.posts.push(newPost);
    return newPost;
  },
  async updatePostById(id: string, body: PostInputModel): Promise<boolean> {
    const { blogId, content, shortDescription, title } = body;
    const foundPostById = db.posts.find((post) => post.id === id);
    const blog = db.blogs.find((blog) => blog.id === blogId);
    if (!foundPostById) {
      return false;
    } else {
      foundPostById.blogId = blogId;
      foundPostById.content = content;
      foundPostById.shortDescription = shortDescription;
      foundPostById.title = title;
      foundPostById.blogName = blog!.name;
      return true;
    }
  },
  async deletePostById(id: string): Promise<boolean> {
    for (let i = 0; i < db.posts.length; i++) {
      if (db.posts[i].id === id) {
        db.posts.splice(i, 1);
        return true;
      }
    }
    return false;
  },
};
