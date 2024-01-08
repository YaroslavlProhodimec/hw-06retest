import { urlBlogsRegex } from "../common-utils/regexes";
import { stringsInputValidatorWithLength } from "../common-utils/validatorForStrings";

export const blogsURLValidator = () => {
  return stringsInputValidatorWithLength("websiteUrl", 100).custom((url) => {
    const testUrl = urlBlogsRegex.test(url);
    if (testUrl) {
      return true;
    } else throw new Error("Url is incorrect");
  });
};

export const blogsValidator = [
  stringsInputValidatorWithLength("name", 15),
  stringsInputValidatorWithLength("description", 500),
  blogsURLValidator(),
];
