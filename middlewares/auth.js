const jwt = require('jsonwebtoken');
const AuthorizationError = require('../utils/authorization-error');
const { jwtSecret } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new AuthorizationError('Нет доступа'));
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
