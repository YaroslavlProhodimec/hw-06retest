import { ObjectId } from "mongodb";
import { refreshTokensBlacklistedCollection } from "../../db";

export const authCommandsRepository = {
  async createUserRefreshTokensBlacklist(userId: ObjectId): Promise<string> {
    const createRefreshTokensBlacklistForUser =
      await refreshTokensBlacklistedCollection.insertOne({
        _id: userId,
        refreshTokensArray: [],
      });
    return createRefreshTokensBlacklistForUser.insertedId.toString();
  },
  async putRefreshTokenToBlacklist(
    refreshToken: string,
    userId: string
  ): Promise<boolean> {
    const addRefreshTokenToBlacklist =
      await refreshTokensBlacklistedCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $push: { refreshTokensArray: refreshToken } }
      );
    return addRefreshTokenToBlacklist.modifiedCount === 1 ? true : false;
  },
};
