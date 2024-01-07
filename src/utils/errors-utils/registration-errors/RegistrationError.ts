import { CommonErrorResponse } from "../CommonErrorResponse";

export class RegistrationError extends CommonErrorResponse {
  message: string;
  field: string;
  constructor() {
    super();
    this.message =
      "Something went wrong with registration/ User was not created";
    this.field = "registration";
  }

  getResult() {
    super.getErrorObject(this.message, this.field);
  }
}
