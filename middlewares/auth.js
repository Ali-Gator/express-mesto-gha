const jwt = require('jsonwebtoken');
const { UNAUTHORIZED_MESSAGE } = require('../utils/constants');
const UnauthorizedError = require('../errors/unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) throw new UnauthorizedError(UNAUTHORIZED_MESSAGE);
    req.user = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
    if (!req.user) throw new UnauthorizedError(UNAUTHORIZED_MESSAGE);
    next();
  } catch (err) {
    next(err);
  }
};
