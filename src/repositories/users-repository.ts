import {ObjectId, WithId} from "mongodb";
import {usersCollection} from "../index";
import bcrypt from 'bcrypt'
import {BlogType} from "../types/blog/output";
import {usersMapper} from "../types/users/mapper";

export class UsersRepository {
    static async getAllUsers(sortData: any) {

        const sortDirection = sortData.sortDirection ?? 'desc'
        const sortBy = sortData.sortBy ?? 'createdAt'
        const searchNameTerm = sortData.searchNameTerm ?? null
        const pageSize = sortData.pageSize ?? 10
        const pageNumber = sortData.pageNumber ?? 1
        // console.log(sortData.searchEmailTerm,'sortData.searchEmailTerm ')
        // console.log(sortData.searchLoginTerm,'sortData.searchLoginTerm ')
        const searchLoginTerm = sortData.searchLoginTerm ?? null
        const searchEmailTerm = sortData.searchEmailTerm ?? null

        let filterLogin = {}
        let filterEmail = {}

        if (searchLoginTerm) {
            filterLogin = {
                login: {
                    $regex: searchLoginTerm,
                    $options: 'i'
                }
            }
        }
        if (searchEmailTerm) {
            filterEmail = {
                email: {
                    $regex: searchEmailTerm,
                    $options: 'i'
                }
            }
        }
        const filter = {
            $or: [
                filterLogin,
                filterEmail,
            ]
        }

        const users: WithId<BlogType>[] = await usersCollection.find(filter)
            .sort(sortBy, sortDirection)
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .toArray()

        const totalCount = await usersCollection
            .countDocuments(filter)

        const pageCount = Math.ceil(totalCount / +pageSize)

        return {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCount,
            items: users.map(usersMapper)
        }

    }
    static async createUser(login: any, email: any, password: any) {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        console.log(passwordSalt,'passwordSalt')
        console.log(passwordHash,'passwordHash')
        const newUser = {
            _id: new ObjectId(),
            login:login,
            email,
            passwordHash,
            passwordSalt,
            createdAt: new Date()
        }

        const result = await usersCollection.insertOne(newUser)
        const user = await usersCollection.findOne({_id: result.insertedId})

        return usersMapper(user)
    }
    static async deleteUser(id: any) {

        try {
            const result = await usersCollection.deleteOne({_id: new ObjectId(id)})
            return result.deletedCount === 1
        } catch (e) {
            return false
        }
    }

    static async checkCredentials(authData: any) {
        console.log(authData,'authData')
        // const sortDirection = authData.sortDirection ?? 'desc'
        // const sortBy = authData.sortBy ?? 'createdAt'
        // const searchNameTerm = authData.searchNameTerm ?? null
        // const pageSize = authData.pageSize ?? 10
        // const pageNumber = authData.pageNumber ?? 1
        const searchLoginTerm = authData.loginOrEmail ?? null
        const searchEmailTerm = authData.loginOrEmail ?? null

        let filterLogin = {}
        let filterEmail = {}
        console.log(searchLoginTerm,'searchLoginTerm')
        console.log(searchEmailTerm,'searchEmailTerm')

        if (searchLoginTerm) {
            filterLogin = {
                'accountData.login': {
                    $regex: searchLoginTerm,
                    $options: 'i'
                }
            }
        }
        if (searchEmailTerm) {
            filterEmail = {
                'accountData.email': {
                    $regex: searchEmailTerm,
                    $options: 'i'
                }
            }
        }

        const filter = {
            $or: [
                filterLogin,
                filterEmail,
            ]
        }
        console.log(filter,'filter')
        const users: any = await usersCollection.findOne(filter)
            // .find(filter)
            // .sort(sortBy, sortDirection)
            // .skip((+pageNumber - 1) * +pageSize)
            // .limit(+pageSize)
            // .toArray()

        console.log(users,'users')

        if (!users) {
            return false
        }

        // const totalCount = await usersCollection
        //     .countDocuments(filter)

        console.log(users.accountData.passwordSalt,
            'users.passwordSalt')
        // const pageCount = Math.ceil(totalCount / +pageSize)
        const passwordHash = await this._generateHash(authData.password, users.accountData.passwordSalt)
        if (users.accountData.passwordHash !== passwordHash){
            return false
        }
            return users

    }


     static async _generateHash(password: any, salt: any) {
         const hash = await bcrypt.hash(password, salt)
         console.log(hash,'hash')

         return hash
    }

}
