import {usersCollection} from "../../index";
import {ObjectId, WithId} from "mongodb";
import {UsersRepository} from "../users-repository";
import {v4 as uuidv4} from "uuid";
import {add} from "date-fns/add";

export const usersCommandsRepository = {
    async createNewUser(newUser: any) {
        const createdUser: WithId<any> = await usersCollection.insertOne(newUser)
        const foundUser = await usersCollection.findOne({_id: new ObjectId(createdUser.insertedId.toString())});
        console.log(foundUser)
        console.log(createdUser, 'createdUser')
        return {
            id: foundUser._id.toString(),
            login: foundUser.accountData.login,
            email: foundUser.accountData.email,
            createdAt: foundUser.accountData.createdAt,
        }
    },

    async updateUserIsConfirmed(_id: ObjectId) {

        const updateIsUserConfirmed = await usersCollection.updateOne({_id}, {
            $set: {
                'emailConfirmation.isConfirmed': true,
                'emailConfirmation.expirationDate': null,
                'emailConfirmation.confirmationCode': null
            }
        })
        console.log(updateIsUserConfirmed, 'updateIsUserConfirmed')
        return updateIsUserConfirmed.modifiedCount === 1;

    },
    async updateUserCodeAndExpirationDate(_id: ObjectId) {

        const updateIsUserConfirmed = await usersCollection.updateMany({_id}, {
            $set: {
                'emailConfirmation.confirmationCode': uuidv4(),
                'emailConfirmation.expirationDate': add(new Date(), {hours: 3, minutes: 3}),
            }
        })
        console.log(updateIsUserConfirmed, 'updateIsUserConfirmed')
        return updateIsUserConfirmed.modifiedCount === 1;

    }
}