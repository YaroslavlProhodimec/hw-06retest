import { TFieldError } from "../../dto/common/ErrorResponseModel";
import {
  TResolutions,
  TResolutionsArray,
  videoResolutions,
} from "../../dto/videosDTO/ResolutionsVideoModel";

const isResolution = (x: TResolutions): x is TResolutions =>
  videoResolutions.includes(x);

export const videoResolutionValidator = (
  availableResolutions: TResolutionsArray
): TFieldError[] => {
  const errors: TFieldError[] = [];
  if (availableResolutions === undefined) {
    errors.push({
      message: "Please include at least 1 resolution",
      field: "availableResolutions",
    });
  } else if (availableResolutions.length === 0) {
    errors.push({
      message: "Please include at least 1 resolution",
      field: "availableResolutions",
    });
  } else {
    let result;
    availableResolutions
      .filter((element) => {
        result = isResolution(element);
        return result === false;
      })
      .map((wrongResolution) =>
        errors.push({
          message: `Resolution ${wrongResolution} is invalid`,
          field: "availableResolutions",
        })
      );
  }
  return errors;
};
