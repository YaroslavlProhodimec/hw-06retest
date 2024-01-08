import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { jwtService } from "../application/jwt-service";
import { ObjectId } from "mongodb";
import { authQueryRepository } from "../repositories/query-repository/authQueryRepository";

export const refreshTokenValidityMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshTokenFromClient = req.cookies.refreshToken;
  if (!refreshTokenFromClient || !refreshTokenFromClient.trim()) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }
  const refreshTokenJWTPayloadResult = await jwtService.getJwtPayloadResult(
    refreshTokenFromClient,
    process.env.REFRESH_TOKEN_SECRET as string
  );

  if (!refreshTokenJWTPayloadResult) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  } else {
    const checkRefreshTokenIsBlacklisted =
      await authQueryRepository.findBlacklistedUserRefreshTokenById(
        new ObjectId(refreshTokenJWTPayloadResult.userId),
        refreshTokenFromClient
      );
    if (checkRefreshTokenIsBlacklisted) {
      res.sendStatus(StatusCodes.UNAUTHORIZED);
      return;
    } else {
      req.userId = refreshTokenJWTPayloadResult.userId;
      next();
    }
  }
};
