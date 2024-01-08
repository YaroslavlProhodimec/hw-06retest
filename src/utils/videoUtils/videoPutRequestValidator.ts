import { TFieldError } from "../../dto/common/ErrorResponseModel";
import { TUpdateVideoInputModel } from "../../dto/videosDTO/UpdateVideoModel";
import { dateISOPattern } from "../common-utils/creation-publication-dates";
import { validatePostBody } from "./videoPostRequestValidator";

export const videoPutRequestValidator = (
  body: TUpdateVideoInputModel
): TFieldError[] => {
  let errors: TFieldError[] = [];
  const {
    title,
    author,
    availableResolutions,
    canBeDownloaded,
    minAgeRestriction,
    publicationDate,
  } = body;
  const titleAuthorResolutionsValidator: TFieldError[] = validatePostBody({
    title,
    author,
    availableResolutions,
  });

  if (typeof canBeDownloaded !== "boolean") {
    errors.push({
      message: "canBeDownloaded should be a boolean value",
      field: "canBeDownloaded",
    });
  }
  if (typeof minAgeRestriction !== "number") {
    errors.push({
      message: "minAgeRestriction should be a number",
      field: "minAgeRestriction",
    });
  } else if (minAgeRestriction < 1 || minAgeRestriction > 18) {
    errors.push({
      message:
        "minAgeRestriction maxLength should be not less than 1 and not more than 18",
      field: "minAgeRestriction",
    });
  }
  if (!publicationDate) {
    errors.push({
      message: "publicationDate should be ISOString",
      field: "publicationDate",
    });
  } else if (typeof publicationDate !== "string") {
    errors.push({
      message: "publicationDate should be String",
      field: "publicationDate",
    });
  } else if (!dateISOPattern.test(publicationDate)) {
    errors.push({
      message:
        "publicationDate should match this regex: /d{4}-[01]d-[0-3]dT[0-2]d:[0-5]d:[0-5]d.d+([+-][0-2]d:[0-5]d|Z)/ ",
      field: "publicationDate",
    });
  }

  return [...errors, ...titleAuthorResolutionsValidator];
};

// const requiredKeys = ["title", "author"];
// const checkIfRequiredFieldsExist = requiredKeys.filter((value) => {
//   const missingField = Object.keys(body).includes(value);
//   return missingField === false;
// });
// if (checkIfRequiredFieldsExist.length > 0) {
//   for (const element of checkIfRequiredFieldsExist) {
//     errors.push({
//       message: `${element} is required`,
//       field: "body",
//     });
//   }
// } else {
