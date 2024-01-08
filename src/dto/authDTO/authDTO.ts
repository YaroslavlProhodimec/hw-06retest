import { ObjectId } from "mongodb";

export type LoginInputModel = {
  loginOrEmail: string;
  password: string;
};

export type MeViewModel = {
  email: string;
  login: string;
  userId: string;
};

export type LoginSuccessViewModel = {
  accessToken: string; //jwt token
};

export type RegistrationConfirmationCodeModel = {
  code: string; //Code that be sent via Email inside link
};

export type RegistrationEmailResending = {
  email: string; //^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$   Email of already registered but not confirmed user
};

export type RefreshTokensBlacklistDB = {
  _id: ObjectId;
  refreshTokensArray: string[];
};
