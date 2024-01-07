export class CommonErrorResponse {
  constructor() {}
  getErrorObject(message: string, field: string) {
    return {
      message,
      field,
    };
  }
}