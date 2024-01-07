import { CommonErrorResponse } from "../CommonErrorResponse";

export class UserAlreadyExistsError extends CommonErrorResponse {
    message: string;
  field: string;
  constructor(field: string, message: string) {
    super();
    this.field = field;
    this.message = message;
  }

  getResult() {
    return super.getErrorObject(this.message, this.field);
  }
}
