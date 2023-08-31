const jwt = require('jsonwebtoken');
const AuthorizationError = require('../utils/authorization-error');
const { jwtSecret } = require('../utils/config');
const { BAD_AUTHORIZATION } = require('../utils/messages');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new AuthorizationError(BAD_AUTHORIZATION));
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : jwtSecret);
  } catch (err) {
    next(new AuthorizationError(err));
  }
  req.user = payload;

  next();
  return null;
};
