import { NextFunction, Request, Response } from "express";
import { commentsCommandsRepository } from "../repositories/commands-repository/commentsCommandsRepository";
import { StatusCodes } from "http-status-codes";
import {validateObjectIdMiddleware} from "./validateObjectIdMiddleware";

export const forbiddenResponseMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const comment = await commentsCommandsRepository.findCommentById(
    req.params.id
  );

  if (!comment) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  } else if (comment && comment.commentatorInfo.userId !== req.user.userId) {
    res.sendStatus(StatusCodes.FORBIDDEN);
  } else {
    next();
  }
};
