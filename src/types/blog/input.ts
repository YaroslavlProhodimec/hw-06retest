export type  BlogParams = {
    id:string
}
export type  CreateBlogDto = {
    name:string,
    description:string,
    websiteUrl:string,
}

export type UpdateBlogDto = {
    name:string,
    description:string,
    websiteUrl:string,
}

export type SortDataType = {
    searchNameTerm?: string,
    sortBy?: string,
    sortDirection?: 'asc' | 'desc',
    pageNumber?: number,
    pageSize?: number,
}