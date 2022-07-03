const jwt = require('jsonwebtoken');
const { UNAUTHORIZED_MESSAGE } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Error(UNAUTHORIZED_MESSAGE);
  }
  const token = authorization.replace('Bearer ', '');
  try {
    req.user = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    throw new Error(UNAUTHORIZED_MESSAGE);
  }
  next();
};
