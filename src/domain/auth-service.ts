import { authCommandsRepository } from "./../repositories/commands-repository/authCommandsRepository";
import { usersCommandsRepository } from "./../repositories/commands-repository/usersCommandsRepository";
import bcrypt from "bcrypt";
import { UserDBType, UserInputModel } from "../dto/usersDTO/usersDTO";
import { emailManager } from "../managers/email-manager";
import { usersService } from "./users-service";
import { creationDate } from "../utils/common-utils/creation-publication-dates";
import { TFieldError } from "../dto/common/ErrorResponseModel";
import { usersQueryRepository } from "../repositories/query-repository/usersQueryRepository";
import { createConfirmationCode } from "../utils/auth-utils/create-user-confirmation-code";
import { createCodeExpirationDate } from "../utils/auth-utils/create-code-expiration-date";
import { UserAlreadyExistsError } from "../utils/errors-utils/registration-errors/UserAlreadyExistsError";
import { RegistrationError } from "../utils/errors-utils/registration-errors/RegistrationError";
import { IncorrectConfirmationCodeError } from "../utils/errors-utils/registration-confirmation-errors/IncorrectConfirmationCodeError";
import { UpdateUserError } from "../utils/errors-utils/registration-confirmation-errors/UpdateUserError";
import { UserIsConfirmedError } from "../utils/errors-utils/registration-confirmation-errors/UserIsConfirmedError";
import { ConfirmationCodeExpiredError } from "../utils/errors-utils/registration-confirmation-errors/ConfirmationCodeExpiredError";
import { EmailAlreadyConfirmedError } from "../utils/errors-utils/resend-email-errors/EmailAlreadyConfirmedError";
import { WrongEmailError } from "../utils/errors-utils/resend-email-errors/WrongEmailError";
import { ObjectId } from "mongodb";

export const authService = {
  async registerNewUser(
    body: UserInputModel
  ): Promise<TFieldError | UserDBType> {
    const { login, email, password } = body;
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await usersService._generateHash(
      password,
      passwordSalt
    );

    const newUser: UserDBType = {
      accountData: {
        passwordSalt,
        passwordHash,
        login,
        email,
        createdAt: creationDate(),
      },
      emailConfirmation: {
        confirmationCode: createConfirmationCode(),
        isConfirmed: false,
        expirationDate: createCodeExpirationDate(),
      },
    };
    const createUser = await usersCommandsRepository.createNewUser(newUser);
    if (createUser === "login") {
      return new UserAlreadyExistsError(
        createUser,
        "User with the given login already exists"
      );
    } else if (createUser === "email") {
      return new UserAlreadyExistsError(
        createUser,
        "User with the given email already exists"
      );
    } else {
      try {
        await emailManager.sendEmail(newUser);
        await this.createRefreshTokenBlacklistForUser(new ObjectId(createUser.id));
        return newUser;
      } catch (error) {
        console.error(error);
        await usersCommandsRepository.deleteUser(createUser.id);
        return new RegistrationError();
      }
    }
  },

  async confirmCode(code: string): Promise<TFieldError | string> {
    const user = await usersQueryRepository.findUserByConfirmationCode(code);
    if (!user || user?.emailConfirmation.confirmationCode !== code) {
      return new IncorrectConfirmationCodeError();
    }
    if (user?.emailConfirmation.isConfirmed) {
      return new UserIsConfirmedError();
    }
    if (
      user?.emailConfirmation.expirationDate &&
      user.emailConfirmation.expirationDate < new Date().toISOString()
    )  {
      return new ConfirmationCodeExpiredError();
    } else {
      const updateIsConfirmedUser =
        await usersCommandsRepository.updateUserIsConfirmed(user._id);
      if (!updateIsConfirmedUser) {
        return new UpdateUserError("registration-confirmation");
      }
      return user.accountData.login;
    }
  },

  async resendEmail(email: string): Promise<TFieldError | string> {
    const user = await usersQueryRepository.findUserByEmail(email);
    if (!user) {
      return new WrongEmailError();
    }
    if (user.emailConfirmation.isConfirmed) {
      return new EmailAlreadyConfirmedError();
    }
    const resendEmailResult = await emailManager.resendEmailWithCode(user);
    if (!resendEmailResult) {
      return new UpdateUserError("registration-email-resending");
    }
    return user.accountData.email;
  },
  async createRefreshTokenBlacklistForUser(
    userId: ObjectId
  ): Promise<string | null> {
    return await authCommandsRepository.createUserRefreshTokensBlacklist(
      userId
    );
  },
  async placeRefreshTokenToBlacklist(
    refreshToken: string,
    userId: string
  ): Promise<boolean> {
    const refreshTokenToBlacklist =
      await authCommandsRepository.putRefreshTokenToBlacklist(
        refreshToken,
        userId
      );
    return refreshTokenToBlacklist;
  },
};
