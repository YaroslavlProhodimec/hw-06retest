import { CustomValidator } from "express-validator";
import { ObjectId } from "mongodb";
import { stringInputValidatorCommon, stringsInputValidatorWithLength } from "../common-utils/validatorForStrings";
import { blogsCollection } from "../../db";


/** This blogId validator is for hardcoded db */
export const isValidObjectId: CustomValidator = (blogId: string) => {
  try {
    if (ObjectId.isValid(blogId)) {
      return true;
    } else {
      throw new Error(
        "This blogId is invalid and doesn't fit the ObjectId 24 hex characters structure"
      );
    }
  } catch (error) {
    throw new Error("Blog ID is invalid");
  }
};

/** This blogId validator is for MONGO DB*/
export const isValidBlogId: CustomValidator = async (blogId: string) => {
  try {
    const blog = await blogsCollection.findOne({ _id: new ObjectId(blogId) });
    if (!blog) {
      throw new Error("Blog with such ID doesn't exist");
    }
    return true;
  } catch (error) {
    throw new Error(
      "This blogId is invalid and doesn't fit the ObjectId 24 hex characters structure"
    );
  }
};

export const postsValidator = [
  stringsInputValidatorWithLength("title", 30),
  stringsInputValidatorWithLength("shortDescription", 100),
  stringsInputValidatorWithLength("content", 1000),
  stringInputValidatorCommon("blogId").custom(isValidBlogId),
];

export const postsValidatorForSpecificBlog = [
  stringsInputValidatorWithLength("title", 30),
  stringsInputValidatorWithLength("shortDescription", 100),
  stringsInputValidatorWithLength("content", 1000),
];