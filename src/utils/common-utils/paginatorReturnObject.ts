// export const paginatorReturnObject = <T>(
//   data: T[],
//   mapperTransformer: Function,
//   totalCount: number,
//   pageSize: number,
//   pageNumber: number
// ) => {
//   const transformedData = data.map((doc) => mapperTransformer(doc));
//   let pagesCount = totalCount === 0 ? 1 : Math.ceil(totalCount / pageSize);
//   return {
//     pagesCount,
//     page: pageNumber,
//     pageSize: pageSize,
//     totalCount,
//     items: transformedData,
//   };
// };