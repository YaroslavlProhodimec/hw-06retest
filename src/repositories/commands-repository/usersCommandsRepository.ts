import {usersCollection} from "../../index";
import {ObjectId, WithId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import {add} from "date-fns/add";
import {defineFieldMongoError} from "../../utils/defineFieldMongoError";

export const usersCommandsRepository = {
    async createNewUser(newUser: any) {
        try {
            await usersCollection.createIndex(
                {"accountData.email": 1},
                {name: "email", unique: true}
            );
            await usersCollection.createIndex(
                {"accountData.login": 1},
                {name: "login", unique: true}
            );
            const createdUser: WithId<any> = await usersCollection.insertOne(newUser)
            console.log(createdUser, 'createdUser')
            const foundUser = await usersCollection.findOne({_id: new ObjectId(createdUser.insertedId.toString())});
            console.log(foundUser)
            console.log(createdUser, 'createdUser')
            return {
                id: foundUser._id.toString(),
                login: foundUser.accountData.login,
                email: foundUser.accountData.email,
                createdAt: foundUser.accountData.createdAt,
            }
        } catch (e: any) {
            return defineFieldMongoError(e.message);
        }

    },
    async findUserById(id: string): Promise<WithId<any> | null> {
        const foundUser = await usersCollection.findOne({_id: new ObjectId(id)});
        return foundUser;
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
    async updateUserCodeAndExpirationDate(_id: ObjectId,
                                          code: string,
                                          expirationDate: string) {
        const findUser = usersCommandsRepository.findUserById(_id.toString());
        if (!findUser) return false;
        const updateIsUserConfirmed = await usersCollection.updateMany(
            {_id},
            {
                $set: {
                    "emailConfirmation.confirmationCode": code,
                    "emailConfirmation.expirationDate": expirationDate,
                },
            }
        );
        return updateIsUserConfirmed.modifiedCount === 1;

    }
}