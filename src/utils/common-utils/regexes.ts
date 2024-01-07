export const userEmailRegex = new RegExp(
  "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"
);
export const userLoginRegex = new RegExp("^[a-zA-Z0-9_-]*$");
export const urlBlogsRegex = new RegExp(
  "^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$"
);
