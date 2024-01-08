import express from "express";

import { basicAuthMiddleware } from "../middlewares/basicAuth";
import { blogsValidator } from "../utils/blogs-utils/blogsValidator";
import { responseErrorValidationMiddleware } from "../middlewares/responseErrorValidationMiddleware";
import {
  createNewBlog,
  createPostForSpecificBlog,
  deleteBlogById,
  getBlogPosts,
  getBlogs,
  getBlogsById,
  updateBlogById,
} from "../controllers/blogsController";
import { validateObjectIdMiddleware } from "../middlewares/validateObjectIdMiddleware";
import { postsValidatorForSpecificBlog } from "../utils/posts-utils/postsValidator";
export const blogsRouter = express.Router({});

//TODO: GET LIST OF BLOGS
blogsRouter.get("/", getBlogs);
//TODO: GET BLOG BY ID
blogsRouter.get("/:id", validateObjectIdMiddleware, getBlogsById);
//TODO: GET ALL POSTS FOR SPECIFIC BLOG
blogsRouter.get("/:id/posts", validateObjectIdMiddleware, getBlogPosts);

//TODO: CREATE POST FOR SPECIFIC BLOG
blogsRouter.post(
  "/:id/posts",
  basicAuthMiddleware,
  validateObjectIdMiddleware,
  postsValidatorForSpecificBlog,
  responseErrorValidationMiddleware,
  createPostForSpecificBlog
);
//TODO: CREATE A NEW BLOG
blogsRouter.post(
  "/",
  basicAuthMiddleware,
  blogsValidator,
  responseErrorValidationMiddleware,
  createNewBlog
);

//TODO: UPDATE BLOG BY ID
blogsRouter.put(
  "/:id",
  basicAuthMiddleware,
  validateObjectIdMiddleware,
  blogsValidator,
  responseErrorValidationMiddleware,
  updateBlogById
);

//TODO: DELETE BLOG BY ID
blogsRouter.delete(
  "/:id",
  basicAuthMiddleware,
  validateObjectIdMiddleware,
  deleteBlogById
);
