import { RegistrationConfirmationError } from "./RegistrationConfirmationError";

export class ConfirmationCodeExpiredError extends RegistrationConfirmationError {
  message: string;
  field: string;
  constructor() {
    super();
    this.message = "Confirmation code is expired";
    this.field = super.getField;
  }

  getResult() {
    return super.getErrorObject(this.message, this.field);
  }
}
