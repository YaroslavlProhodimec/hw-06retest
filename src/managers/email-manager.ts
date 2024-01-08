import {htmlEmailConfirmationCodeLetter} from "../utils/html-email";
import {emailAdapter} from "../adapters/email-adapter";
import {usersCommandsRepository} from "../repositories/commands-repository/usersCommandsRepository";
import {createCodeExpirationDate} from "../utils/auth-utils/create-code-expiration-date";
import {createConfirmationCode} from "../utils/auth-utils/create-user-confirmation-code";
import {WithId} from "mongodb";

export const emailManager = {
    async sendEmail(user: any) {
        console.log(user, 'user')
        const code = user.emailConfirmation.confirmationCode;
        const html = htmlEmailConfirmationCodeLetter(code);
        console.log(html, 'html')
        await emailAdapter.sendEmail(user.accountData.email, html);
    },
    async resendEmailWithCode(user: WithId<any>): Promise<boolean> {
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
}
