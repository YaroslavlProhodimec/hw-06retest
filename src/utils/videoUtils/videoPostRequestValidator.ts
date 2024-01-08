import { TCreateVideoInputModel } from "../../dto/videosDTO/CreateVideoModel";
import { TFieldError } from "../../dto/common/ErrorResponseModel";
import { videoResolutionValidator } from "./videoResolutionValidator";
import { videoTitleAuthorValidation } from "./videoTitleAuthorValidator";

export const validatePostBody = (
  body: TCreateVideoInputModel
): TFieldError[] => {
  const { title, author, availableResolutions } = body;
  const errors: TFieldError[] = [];

  const titleErrors = videoTitleAuthorValidation(title, 40, "title");
  const authorErrors = videoTitleAuthorValidation(author, 20, "author");
  const resolutionsErrors = videoResolutionValidator(availableResolutions);

  return [...errors, ...titleErrors, ...authorErrors, ...resolutionsErrors];
};
