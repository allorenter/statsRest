export default class GeneralError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.errorCode = 500;
  }

  getCode() {
    return this.errorCode;
  }
}
