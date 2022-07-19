const { ALLOWED_CORS, DEFAULT_ALLOWED_METHODS } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { headers: { origin }, method } = req;
  if (method === 'OPTIONS') {
    const reqHeaders = req.headers['access-control-request-headers'];
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', reqHeaders);
    return res.end();
  }
  if (ALLOWED_CORS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    next();
  }
};
