export const videoResolutions: TResolutionsArray = [
  "P144",
  "P240",
  "P360",
  "P480",
  "P720",
  "P1080",
  "P1440",
  "P2160",
];
export type TResolutions =
  | "P144"
  | "P240"
  | "P360"
  | "P480"
  | "P720"
  | "P1080"
  | "P1440"
  | "P2160";
type NonEmptyArray<T> = [T, ...T[]];

export type TResolutionsArray = NonEmptyArray<TResolutions>;
