import bcrypt from "bcrypt";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from 'uuid';
import {add} from 'date-fns/add'
import {emailManager} from "../managers/email-manager";
import {usersCommandsRepository} from "../repositories/commands-repository/usersCommandsRepository";
import {usersCollection} from "../index";
import {UserAlreadyExistsError} from "../utils/errors-utils/registration-errors/UserAlreadyExistsError";
import {RegistrationError} from "../utils/errors-utils/registration-errors/RegistrationError";
import {
    IncorrectConfirmationCodeError
} from "../utils/errors-utils/registration-confirmation-errors/IncorrectConfirmationCodeError";
import {UserIsConfirmedError} from "../utils/errors-utils/registration-confirmation-errors/UserIsConfirmedError";
import {UpdateUserError} from "../utils/errors-utils/registration-confirmation-errors/UpdateUserError";
import {
    ConfirmationCodeExpiredError
} from "../utils/errors-utils/registration-confirmation-errors/ConfirmationCodeExpiredError";
import {WrongEmailError} from "../utils/errors-utils/resend-email-errors/WrongEmailError";
import {EmailAlreadyConfirmedError} from "../utils/errors-utils/resend-email-errors/EmailAlreadyConfirmedError";

export const authService = {
    async createUser(login: string, email: string, password: string) {
        const passwordHash = await this._generateHash(password)
        const user = {
            _id: new ObjectId(),
            accountData: {
                login,
                email,
                passwordHash,
                createdAt: new Date()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {hours: 3, minutes: 3}),
                isConfirmed: false
            }
        }
        const createUser = await usersCommandsRepository.createNewUser(user)
        console.log(createUser, 'createUser')
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
        }
        try {
            await emailManager.sendEmail(user)
        } catch (e) {
            await usersCollection.deleteOne(user._id)
            return new RegistrationError();

        }
        return createUser

    },
    async confirmCode(code: string) {
        console.log(code, 'code')
        const foundedUser = await usersCollection.findOne({'emailConfirmation.confirmationCode': code})
        if (!foundedUser || foundedUser?.emailConfirmation.confirmationCode !== code) {
            return new IncorrectConfirmationCodeError();
        }
        if (foundedUser?.emailConfirmation.isConfirmed) {
            return new UserIsConfirmedError();
        }
        if (!foundedUser && foundedUser?.emailConfirmation.expirationDate < new Date().toISOString()) {
            return new ConfirmationCodeExpiredError();
        } else {
            console.log(foundedUser, 'foundedUser')
            console.log(foundedUser._id, 'foundedUser._id')
            const updateIsConfirmedUser = await usersCommandsRepository.updateUserIsConfirmed(foundedUser._id);
            if (!updateIsConfirmedUser) {
                return new UpdateUserError("registration-confirmation");
            }
            return foundedUser.accountData.login
        }


    },

    async resendEmail(email: string) {

        const foundedUser = await usersCollection.findOne({'accountData.email': email})

        console.log(foundedUser, 'foundedUser resendEmail')

        if (!foundedUser) {
            return new EmailAlreadyConfirmedError();
        }
        if (foundedUser?.emailConfirmation.isConfirmed) {
            return new EmailAlreadyConfirmedError();
        }

        const resendEmailResult = await emailManager.resendEmailWithCode(foundedUser)
        if (!resendEmailResult) {
            return new UpdateUserError("registration-email-resending");
        }
        return foundedUser.accountData.email;

    },
    async _generateHash(password: any,) {
        const passwordSalt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, passwordSalt)
        console.log(hash, 'hash')

        return hash
    }
}