import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import { videosRouter } from "./routers/video-router";
import { testingRouter } from "./routers/testing-router";
import { blogsRouter } from "./routers/blogs-router";
import { postsRouter } from "./routers/posts-router";
import { authRouter } from "./routers/auth-router";
import { usersRouter } from "./routers/users-router";
import { commentsRouter } from "./routers/comments-router";
import { httpMethodsCheckMiddleware } from "./middlewares/httpMethodsCheckMiddleware";
import morgan from "morgan";
import { StatusCodes } from "http-status-codes";

export const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(httpMethodsCheckMiddleware);
app.use(cookieParser());

app.use("/api/videos", videosRouter);
app.use("/api/testing", testingRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/posts", postsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/comments", commentsRouter);
app.use(async (req: Request, res: Response, next: NextFunction) => {
  next(StatusCodes.NOT_FOUND);
});
