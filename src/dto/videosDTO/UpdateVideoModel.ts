import { TCreateVideoInputModel } from "./CreateVideoModel";

export type TUpdatePartialFields = {
  canBeDownloaded: boolean; //by default = false
  minAgeRestriction: number | null; //max=18, min=1
  publicationDate: string;
};

export type TUpdateVideoInputModel = TCreateVideoInputModel &
  Partial<TUpdatePartialFields>;
