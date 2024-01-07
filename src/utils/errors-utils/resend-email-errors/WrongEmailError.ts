import { ResendEmailError } from "./ResendEmailError";

export class WrongEmailError extends ResendEmailError {
  message: string;
  field: string;
  constructor() {
    super();
    this.message = "User with such email doesn't exist";
    this.field = super.getField;
  }

  getResult() {
    super.getErrorObject(this.message, this.field);
  }
}
