import { validateObjectIdMiddleware } from "../middlewares/validateObjectIdMiddleware";
import express from "express";
import {
  addNewUserBySuperAdmin,
  deleteUser,
  getAllUsers,
} from "../controllers/usersController";
import { basicAuthMiddleware } from "../middlewares/basicAuth";
import { createUserValidator } from "../utils/usersUtils/users-validator";
import { responseErrorValidationMiddleware } from "../middlewares/responseErrorValidationMiddleware";
export const usersRouter = express.Router({});

usersRouter.get("/", basicAuthMiddleware, getAllUsers);
usersRouter.post(
  "/",
  basicAuthMiddleware,
  createUserValidator,
  responseErrorValidationMiddleware,
  addNewUserBySuperAdmin
);
usersRouter.delete(
  "/:id",
  basicAuthMiddleware,
  validateObjectIdMiddleware,
  deleteUser
);
