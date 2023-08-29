const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../utils/not-found-error');
const BadRequest = require('../utils/bad-request-error');
const AuthorizationError = require('../utils/authorization-error');
const ConflictError = require('../utils/conflict-error');

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
        next(new BadRequest('Ошибка валидации пользователя'));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с данным email уже существует'));
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
        next(new NotFoundError('Пользователь не найден'));
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Ошибка при поиске пользователя'));
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
        next(new NotFoundError('Пользователь не найден'));
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Ошибка при поиске пользователя'));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password, name } = req.body;
  return User.findUserByCredentials(email, password, name)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'super-strong-password',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        httpOnly: true,
      });
      return res.send({ token });
    })
    .catch(() => {
      next(new AuthorizationError('Ошибка при авторизации'));
    });
};

module.exports.signout = (req, res) => {
  res.status(202).clearCookie('jwt').send('Куки удалены');
};
