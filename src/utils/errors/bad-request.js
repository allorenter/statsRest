import GeneralError from './general-error';

export default class BadRequest extends GeneralError {
  constructor(message) {
    super(message);
    this.message = message;
    this.errorCode = 400;
  }
}
