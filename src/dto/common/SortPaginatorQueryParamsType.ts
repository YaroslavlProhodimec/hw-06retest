export type QueryParamsWithSearch = PaginationSortingQueryParams & {
  searchNameTerm: string; //default = null but ParseQs doesn't accept null so I made empty string as a default value
};

export type PaginationSortingQueryParams = {
  sortBy: string; //default = createdAt
  sortDirection: "asc" | "desc"; //default = desc
  pageNumber: string; //default = 1
  pageSize: string; //default = 10
};
