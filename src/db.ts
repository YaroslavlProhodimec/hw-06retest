import { Db, MongoClient } from "mongodb";
import { PostDBType } from "./dto/postsDTO/PostModel";
import * as dotenv from "dotenv";
import { BlogDBType } from "./dto/blogsDTO/BlogModel";
import { UserDBType } from "./dto/usersDTO/usersDTO";
import { CommentDBType } from "./dto/commentsDTO/commentsDTO";
import { RefreshTokensBlacklistDB } from "./dto/authDTO/authDTO";
dotenv.config();
const mongoUri = process.env.MONGO_URL; /*|| "mongodb://0.0.0.0:27017"*/

const client: MongoClient = new MongoClient(mongoUri as string);
const dbName = "blogs-posts";
export const mongoDB: Db = client.db(dbName);

export const blogsCollection = mongoDB.collection<BlogDBType>("blogs");
export const postsCollection = mongoDB.collection<PostDBType>("posts");
export const videosCollection = mongoDB.collection<any>("videos");
export const usersCollection = mongoDB.collection<UserDBType>("users");
export const commentsCollection = mongoDB.collection<CommentDBType>("comments");
export const refreshTokensBlacklistedCollection =
  mongoDB.collection<RefreshTokensBlacklistDB>("refresh-tokens-blacklisted");

export const runDB = async () => {
  try {
    await client.connect();
    console.log("Connected successfully to mongo server");
    await mongoDB.command({ ping: 1 });
    console.log("Client connected");
  } catch (e) {
    console.log("Can't connect to DB: ", e);
    await client.close();
  }
};
