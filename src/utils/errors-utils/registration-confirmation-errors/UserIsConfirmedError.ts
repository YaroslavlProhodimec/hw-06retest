import { RegistrationConfirmationError } from "./RegistrationConfirmationError";

export class UserIsConfirmedError extends RegistrationConfirmationError {
  message: string;
  field: string;
  constructor() {
    super();
    this.message = "User was already confirmed";
    this.field = super.getField;
  }

  getResult() {
    return super.getErrorObject(this.message, this.field);
  }
}
