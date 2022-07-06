const { BAD_REQUEST_ERROR, BAD_REQUEST_MESSAGE, CONFLICT_MESSAGE } = require('../utils/constants');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const {
    statusCode = 500, message, name, code,
  } = err;
  if (code === 11000) {
    return res.status(409).send({ message: CONFLICT_MESSAGE });
  }

  switch (name) {
    case 'CastError':
      res.status(BAD_REQUEST_ERROR).send({ message: BAD_REQUEST_MESSAGE });
      break;
    case 'ValidationError':
      res.status(BAD_REQUEST_ERROR).send({ message: BAD_REQUEST_MESSAGE });
      break;
    default:
      res.status(statusCode).send({
        message: statusCode === 500
          ? 'Server error'
          : message,
      });
  }
};

module.exports = errorHandler;
