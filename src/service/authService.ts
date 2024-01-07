import bcrypt from "bcrypt";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from 'uuid';
import {add} from 'date-fns/add'
import {emailManager} from "../managers/email-manager";
import {usersCommandsRepository} from "../repositories/commands-repository/usersCommandsRepository";
import {usersCollection} from "../index";

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
        const createResult = await usersCommandsRepository.createNewUser(user)
        console.log(createResult, 'createResult')

        if (!createResult) {
            return false
        }
        try {
            await emailManager.sendEmail(user)
        } catch (e) {
            await usersCollection.deleteOne(user._id)
            return null
        }
        return createResult

    },
    async confirmCode(code: string) {
        console.log(code, 'code')
        const foundedUser = await usersCollection.findOne({'emailConfirmation.confirmationCode': code})
        if (!foundedUser || foundedUser?.emailConfirmation.confirmationCode !== code) {
            return false
        }
        if (foundedUser?.emailConfirmation.isConfirmed) {
            return false
        }
        if (!foundedUser && foundedUser?.emailConfirmation.expirationDate < new Date().toISOString()) {
            return false
        } else {
            console.log(foundedUser, 'foundedUser')
            console.log(foundedUser._id, 'foundedUser._id')
            const updateIsConfirmedUser = await usersCommandsRepository.updateUserIsConfirmed(foundedUser._id);
            if (!updateIsConfirmedUser) {
                return false
            }
            return foundedUser.accountData.login
        }


    },

    async resendEmail(email: string) {

        const foundedUser = await usersCollection.findOne({'accountData.email': email})

        console.log(foundedUser, 'foundedUser resendEmail')

        if (!foundedUser) {
            return false
        }
        if (foundedUser?.emailConfirmation.isConfirmed) {
            return false
        }
        try {
            await emailManager.resendEmailWithCode(foundedUser)
        } catch (e) {
            return false
        }
        return foundedUser

    },
    async _generateHash(password: any,) {
        const passwordSalt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, passwordSalt)
        console.log(hash, 'hash')

        return hash
    }
}