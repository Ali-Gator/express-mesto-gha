const { CONFLICT_ERR } = require('../utils/constants');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT_ERR;
  }
}

module.exports = ConflictError;
