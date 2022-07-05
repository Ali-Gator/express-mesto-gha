const { NOT_FOUND_ERR } = require('../utils/constants');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND_ERR;
  }
}

module.exports = NotFoundError;
