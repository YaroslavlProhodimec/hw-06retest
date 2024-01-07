import { ResendEmailError } from "./ResendEmailError";

export class EmailAlreadyConfirmedError extends ResendEmailError {
  message: string;
  field: string;
  constructor() {
    super();
    this.message =
      "Email is already confirmed";
    this.field = super.getField;
  }

  getResult() {
    super.getErrorObject(this.message, this.field);
  }
}