const { UNAUTHORIZED_ERR } = require('../utils/constants');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED_ERR;
  }
}

module.exports = UnauthorizedError;
