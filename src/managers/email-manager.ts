import { WithId } from "mongodb";
import { emailAdapter } from "../adapters/email-adapter";
import { UserDBType } from "../dto/usersDTO/usersDTO";
import { htmlEmailConfirmationCodeLetter } from "../utils/html-utils/html-email-confirmation-code-letter";
import { createConfirmationCode } from "../utils/auth-utils/create-user-confirmation-code";
import { usersCommandsRepository } from "../repositories/commands-repository/usersCommandsRepository";
import { createCodeExpirationDate } from "../utils/auth-utils/create-code-expiration-date";

export const emailManager = {
  async resendEmailWithCode(user: WithId<UserDBType>): Promise<boolean> {
      const newCode = createConfirmationCode();
      const newExpirationDate = createCodeExpirationDate();

      const updatedUser =
        await usersCommandsRepository.updateUserCodeAndExpirationDate(
          user._id,
          newCode,
          newExpirationDate
        );
      if (!updatedUser) {
        return false;
      } else {
        const foundUpdatedUser = await usersCommandsRepository.findUserById(
          user._id.toString()
        );
        if (!foundUpdatedUser) return false;

        const html = htmlEmailConfirmationCodeLetter(
          foundUpdatedUser.emailConfirmation.confirmationCode
        );

        await emailAdapter.sendEmail(foundUpdatedUser?.accountData.email, html);
        return true;
      }
  },
  async sendEmail(user: UserDBType) {
    const code = user.emailConfirmation.confirmationCode;
    const html = htmlEmailConfirmationCodeLetter(code);
    await emailAdapter.sendEmail(user.accountData.email, html);
  },
};
