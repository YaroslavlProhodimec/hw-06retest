import { TFieldError } from "../../dto/common/ErrorResponseModel";

export const videoTitleAuthorValidation = (
  title_or_author: string,
  maxLength: number,
  field: string
): TFieldError[] => {
  const errors: TFieldError[] = [];
  if (title_or_author === undefined || title_or_author === null) {
    errors.push({ message: `Please include a valid ${field}`, field });
  } else if (typeof title_or_author !== "string") {
    errors.push({ message: `${field} must be of type 'string'`, field });
  } else if (!title_or_author.trim()) {
    errors.push({ message: `${field} is invalid`, field });
  } else if (title_or_author.length > maxLength) {
    errors.push({
      message: `${field}'s maximum length must be ${maxLength}`,
      field,
    });
  }
  return errors;
};
