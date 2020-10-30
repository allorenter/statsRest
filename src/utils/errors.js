class GeneralError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
  }

  getCode() {
    // eslint-disable-next-line no-use-before-define
    if (this instanceof BadRequest) {
      return 400;
    }
    return 500;
  }
}

class BadRequest extends GeneralError {}

class NotFound extends GeneralError {}

class InvalidCompetititons extends GeneralError {
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

export {
  GeneralError, BadRequest, NotFound, InvalidCompetititons,
};
