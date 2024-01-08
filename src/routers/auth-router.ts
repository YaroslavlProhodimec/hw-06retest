import { refreshTokenValidityMiddleware } from "../middlewares/refreshTokenValidityMiddleware";
import express from "express";
import { responseErrorValidationMiddleware } from "../middlewares/responseErrorValidationMiddleware";
import { authValidator } from "../utils/auth-utils/auth-validator";
import {
  confirmRegistration,
  getInfoAboutUser,
  logIn,
  logout,
  refreshToken,
  registerUser,
  resendRegistrationEmail,
} from "../controllers/authController";
import { accessTokenValidityMiddleware } from "../middlewares/accessTokenValidityMiddleware";
import { createUserValidator } from "../utils/usersUtils/users-validator";
import { confirmationCodeValidator } from "../utils/usersUtils/confirmationCodeValidator";
import { emailValidator } from "../utils/usersUtils/emailValidator";
export const authRouter = express.Router({});

authRouter.post(
  "/login",
  authValidator,
  responseErrorValidationMiddleware,
  logIn
);

authRouter.get(
  "/me",
  accessTokenValidityMiddleware,
  getInfoAboutUser
);

authRouter.post(
  "/registration",
  createUserValidator,
  responseErrorValidationMiddleware,
  registerUser
);

authRouter.post(
  "/registration-confirmation",
  confirmationCodeValidator,
  responseErrorValidationMiddleware,
  confirmRegistration
);

authRouter.post(
  "/registration-email-resending",
  emailValidator,
  responseErrorValidationMiddleware,
  resendRegistrationEmail
);

authRouter.post("/refresh-token", refreshTokenValidityMiddleware, refreshToken);

authRouter.post("/logout", refreshTokenValidityMiddleware, logout);
