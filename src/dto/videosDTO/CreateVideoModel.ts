import { TResolutionsArray } from "./ResolutionsVideoModel";
import { TUpdateVideoInputModel } from "./UpdateVideoModel";

export type RequiredVideoBodyProperties = {
  title: string; // required, maxLength = 40
  author: string; //required, maxLength = 20
};
export type TCreateVideoInputModel = Required<RequiredVideoBodyProperties> & {
  availableResolutions: TResolutionsArray;
};

export type TVideo = TUpdateVideoInputModel & {
  id: number;
  createdAt: string;
};
