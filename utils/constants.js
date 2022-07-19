module.exports = {
  DEFAULT_PORT: 3000,
  SECRET_KEY: 'vasyapetrov',
  BAD_REQUEST_ERROR: 400,
  BAD_REQUEST_MESSAGE: 'Bad request. Check request data and try again',
  UNAUTHORIZED_ERR: 401,
  UNAUTHORIZED_MESSAGE: 'Email and/or password are wrong',
  FORBIDDEN_ERR: 403,
  FORBIDDEN_MESSAGE: 'You can delete ONLY yours cards',
  NOT_FOUND_ERR: 404,
  NOT_FOUND_MESSAGE: 'There\'s not such data in database',
  CONFLICT_ERR: 409,
  CONFLICT_MESSAGE: 'Email is already used',
  INTERNAL_SERVER_ERROR: 500,
  INTERNAL_SERVER_MESSAGE: 'Unknown error. Please check!',
  // eslint-disable-next-line no-useless-escape
  URL_REGEXP: /^https?:\/\/[www\.]?[\dA-Za-z\-\._~:\/\?#\[\]@!\$&'\(\)\*\+,;=]+/i,
  ALLOWED_CORS: [
    'localhost:3000',
  ],
  DEFAULT_ALLOWED_METHODS: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};
