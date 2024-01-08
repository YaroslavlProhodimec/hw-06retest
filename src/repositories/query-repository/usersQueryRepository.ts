import {SortDirection, WithId} from "mongodb";
import {usersCollection} from "../../index";

export const usersQueryRepository = {
  // async getUsers(
  //   pageNumber: number,
  //   sortBy: string,
  //   pageSize: number,
  //   sortDirection: SortDirection,
  //   searchEmailTerm: string,
  //   searchLoginTerm: string
  // ): Promise<Paginator<UserViewModel>> {
  //   const skip = paginationHandler(pageNumber, pageSize);
  //   const filterTotal: Array<Filter<UserDBType>> = [];
  //   const filterEmail: Filter<UserDBType> = {};
  //   const filterLogin: Filter<UserDBType> = {};
  //
  //   if (searchEmailTerm) {
  //     filterEmail.email = { $regex: searchEmailTerm, $options: "ix" };
  //     filterTotal.push(filterEmail);
  //   }
  //   if (searchLoginTerm) {
  //     filterLogin.login = { $regex: searchLoginTerm, $options: "ix" };
  //     filterTotal.push(filterLogin);
  //   }
  //   const filter = {
  //     $or: filterTotal.length > 0 ? filterTotal : [{}],
  //   };
  //   const totalCount = await usersCollection.countDocuments(filter);
  //
  //   const foundUsers = await usersCollection
  //     .find(filter)
  //     .sort(sortBy, sortDirection)
  //     .skip(skip)
  //     .limit(pageSize)
  //     .toArray();
  //   return paginatorReturnObject<UserDBType>(
  //     foundUsers,
  //     transformUsersResponse,
  //     totalCount,
  //     pageSize,
  //     pageNumber
  //   );
  // },
  // async findByLoginOrEmail(
  //   loginOrEmail: string
  // ): Promise<WithId<UserDBType> | null> {
  //   const isUserExist = await usersCollection.findOne({
  //     $or: [
  //       { "accountData.login": loginOrEmail },
  //       { "accountData.email": loginOrEmail },
  //     ],
  //   });
  //   return isUserExist;
  // },
  async findUserByConfirmationCode(
    code: string
  ): Promise<WithId<any> | null> {
    const foundUser = await usersCollection.findOne({
      "emailConfirmation.confirmationCode": code,
    });
    return foundUser;
  },
  async findUserByEmail(email: string): Promise<WithId<any> | null> {
    const user = await usersCollection.findOne({ "accountData.email": email });
    return user;
  },
  async findUserByEmailAndLogin(
    email: string,
    login: string
  ): Promise<WithId<any> | null> {
    const isUserExist = await usersCollection.findOne({
      $or: [{ "accountData.login": login }, { "accountData.email": email }],
    });
    return isUserExist;
  },
};