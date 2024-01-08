import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
let authValue;
export let basicAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  authValue = req.get("Authorization");
  if (!authValue) {
    res.set({
      "WWW-Authenticate": "Basic",
    });
    res.sendStatus(StatusCodes.UNAUTHORIZED);
  } else {
    let credentials = Buffer.from(authValue.split(" ")[1], "base64")
      .toString()
      .split(":");
    let authType = authValue.split(" ")[0].toLowerCase();
    let username = credentials[0];
    let password = credentials[1];
    if (
      !(authType === "basic" && username === "admin" && password === "qwerty")
    ) {
      res.set({
        "WWW-Authenticate": "Basic",
      });
      res.sendStatus(StatusCodes.UNAUTHORIZED);
    } else {
      next();
    }
  }
};
