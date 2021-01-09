import GeneralError from './general-error';

export default class InvalidCompetititons extends GeneralError {
  constructor(message, competitions = []) {
    super(message);
    this.competitions = competitions;
  }

  getFormat() {
    return {
      type: 'InvalidCompetitions',
      message: this.message,
      competitions: this.competitions,
    };
  }
}
