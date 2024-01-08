import { responseErrorValidationMiddleware } from "./../middlewares/responseErrorValidationMiddleware";
import express from "express";
import {
  deleteComment,
  getCommentById,
  updateComment,
} from "../controllers/commentsController";
import { accessTokenValidityMiddleware } from "../middlewares/accessTokenValidityMiddleware";
import { forbiddenResponseMiddleware } from "../middlewares/forbiddenResponseMiddleware";
import { commentValidator } from "../utils/comments-utils/commentValidator";
import { validateObjectIdMiddleware } from "../middlewares/validateObjectIdMiddleware";

export const commentsRouter = express.Router({});

commentsRouter.get("/:id",
    validateObjectIdMiddleware, getCommentById);

commentsRouter.delete(
  "/:id",
  accessTokenValidityMiddleware,
  validateObjectIdMiddleware,
  forbiddenResponseMiddleware,
  deleteComment
);

commentsRouter.put(
  "/:id",
  accessTokenValidityMiddleware,
    validateObjectIdMiddleware,
    forbiddenResponseMiddleware,
  commentValidator,
  responseErrorValidationMiddleware,
  updateComment
);
