import { UserNotRegisteredField } from "../../dto/common/MongoErrorTypes";

export const defineFieldMongoError = (
  error: string
): UserNotRegisteredField => {
  let result;
  if (error.includes("email")) {
    result = "email";
  } else {
    result = "login";
  }
  return result as UserNotRegisteredField;
};
