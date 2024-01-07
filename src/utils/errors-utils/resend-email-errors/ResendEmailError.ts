import { CommonErrorResponse } from "../CommonErrorResponse";

export class ResendEmailError extends CommonErrorResponse {
  field: string;
  constructor() {
    super();
    this.field = "email";
  }
  get getField() {
    return this.field;
  }
}
