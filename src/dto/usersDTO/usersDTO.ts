import { ObjectId } from "mongodb";
import { PaginationSortingQueryParams } from "../common/SortPaginatorQueryParamsType";

export type UserInputModel = {
  login: string; // maxLength: 10, minLength: 3, pattern: ^[a-zA-Z0-9_-]*$
  password: string; // maxLength: 20, minLength: 6
  email: string; // pattern: ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
};

export type UserViewModel = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type UserDBType = {
  _id?: ObjectId;
  accountData: {
    login: string;
    email: string;
    createdAt: string;
    passwordHash: string;
    passwordSalt: string;
  };
  emailConfirmation: {
    isConfirmed: boolean;
    confirmationCode: string | null;
    expirationDate: string | null;
  };
};

export type UsersQueryParams = PaginationSortingQueryParams & {
  searchLoginTerm: string;
  searchEmailTerm: string;
};
