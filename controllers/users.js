const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../utils/not-found-error');
const BadRequest = require('../utils/bad-request-error');
const AuthorizationError = require('../utils/authorization-error');
const ConflictError = require('../utils/conflict-error');
const { jwtSecret } = require('../utils/config');
const {
  BAD_AUTHORIZATION,
  BAD_USER_VALIDATION,
  USER_CONFLICT,
  USER_NOT_FOUND,
  BAD_REQUEST,
  DELETED_COOKIES,
} = require('../utils/messages');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      _id: user._id,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(BAD_USER_VALIDATION));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictError(USER_CONFLICT));
        return;
      }
      next(err);
    });
};

module.exports.getUserData = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError(USER_NOT_FOUND));
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(BAD_REQUEST));
        return;
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError(USER_NOT_FOUND));
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(BAD_USER_VALIDATION));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictError(USER_CONFLICT));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : jwtSecret,
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      });
      return res.send({ token });
    })
    .catch(() => {
      next(new AuthorizationError(BAD_AUTHORIZATION));
    });
};

module.exports.signout = (req, res) => {
  res.status(200).clearCookie().json({ message: DELETED_COOKIES });
};
