import { RegistrationConfirmationError } from "./RegistrationConfirmationError";

export class UpdateUserError extends RegistrationConfirmationError {
    message: string;
    field: string;
    constructor(field: string) {
      super();
      this.message = "Something went wrong with update operation";
      this.field = field;
    }
  
    getResult() {
      return super.getErrorObject(this.message, this.field);
    }
  }