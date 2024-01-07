import {htmlEmailConfirmationCodeLetter} from "../utils/html-email";
import {emailAdapter} from "../adapters/email-adapter";
import {usersCommandsRepository} from "../repositories/commands-repository/usersCommandsRepository";
import {usersCollection} from "../index";

export const emailManager = {
    async sendEmail(user: any) {
        console.log(user, 'user')
        const code = user.emailConfirmation.confirmationCode;
        const html = htmlEmailConfirmationCodeLetter(code);
        console.log(html, 'html')
        await emailAdapter.sendEmail(user.accountData.email, html);
    },
    async resendEmailWithCode(user: any) {
        const updatedUser = usersCommandsRepository.updateUserCodeAndExpirationDate(user._id)
        if (!updatedUser) {
            return false
        }
        const foundUser = await usersCollection.findOne({_id: user._id});
        if (!foundUser) {
            return false
        }
        const html = htmlEmailConfirmationCodeLetter(foundUser.emailConfirmation.confirmationCode);
        await emailAdapter.sendEmail(foundUser.accountData.email, html);

        return true;

    }
}