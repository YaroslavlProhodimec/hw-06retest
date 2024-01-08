import express from "express";
import { StatusCodes } from "http-status-codes";
import { mongoDB } from "../db";
export const testingRouter = express.Router({});

//TODO REMOVE ALL COURSES
testingRouter.delete("/all-data", async (req, res) => {
  const result = await mongoDB.collections();
  result.map((collection) => collection.deleteMany({}));
  res.sendStatus(StatusCodes.NO_CONTENT);
});
