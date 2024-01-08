import express from "express";
import { basicAuthMiddleware } from "../middlewares/basicAuth";
export const postsRouter = express.Router({});
import { postsValidator } from "../utils/posts-utils/postsValidator";
import { responseErrorValidationMiddleware } from "../middlewares/responseErrorValidationMiddleware";
import {
  createComment,
  createNewPost,
  deletePostById,
  findCommentsForSpecifiedPost,
  getPosts,
  getPostsById,
  updatePostById,
} from "../controllers/postsController";
import { validateObjectIdMiddleware } from "../middlewares/validateObjectIdMiddleware";
import { accessTokenValidityMiddleware } from "../middlewares/accessTokenValidityMiddleware";
import { commentValidator } from "../utils/comments-utils/commentValidator";

//TODO: GET LIST OF POSTS
postsRouter.get("/", getPosts);

//TODO: GET POST BY ID
postsRouter.get("/:id", validateObjectIdMiddleware, getPostsById);

//TODO: CREATE A NEW POST
postsRouter.post(
  "/",
  basicAuthMiddleware,
  postsValidator,
  responseErrorValidationMiddleware,
  createNewPost
);

//TODO: UPDATE POST BY ID
postsRouter.put(
  "/:id",
  basicAuthMiddleware,
  validateObjectIdMiddleware,
  postsValidator,
  responseErrorValidationMiddleware,
  updatePostById
);

//TODO: DELETE POST BY ID
postsRouter.delete(
  "/:id",
  basicAuthMiddleware,
  validateObjectIdMiddleware,
  deletePostById
);

//TODO: CREATE COMMENT FOR SPECIFIC POST
postsRouter.post(
  "/:id/comments",
  accessTokenValidityMiddleware,
  validateObjectIdMiddleware,
  commentValidator,
  responseErrorValidationMiddleware,
  createComment
);

//TODO: RETURN COMMENTS FOR SPECIFIED POST
postsRouter.get(
  "/:id/comments",
  validateObjectIdMiddleware,
  findCommentsForSpecifiedPost
);
