import { CommonErrorResponse } from "../CommonErrorResponse";

export class RegistrationConfirmationError extends CommonErrorResponse {
  field: string;
  constructor() {
    super();
    this.field = "code";
  }
  get getField() {
    return this.field;
  }
}
