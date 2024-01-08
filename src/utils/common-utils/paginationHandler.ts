export function paginationHandler(pageNumber: number, pageSize: number) {
  const skip = ((pageNumber || 1) - 1) * (pageSize || 10);

  return skip;
}