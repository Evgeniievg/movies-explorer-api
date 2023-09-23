const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const BadRequest = require('../utils/bad-request-error');
const { BAD_URL } = require('../utils/messages');

const urlValidation = (url) => {
  const validity = validator.isURL;
  if (!validity) {
    throw new BadRequest(BAD_URL);
  }
  return url;
};

module.exports.signinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .min(2)
      .max(30)
      .required()
      .email(),
    password: Joi.string().min(2).max(30).required(),
  }),
});

module.exports.signupValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .min(2)
      .max(30)
      .email()
      .required(),
    password: Joi.string().min(6).max(30).required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

module.exports.updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
});

module.exports.createMovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().custom(urlValidation).required(),
    trailerLink: Joi.string().custom(urlValidation).required(),
    thumbnail: Joi.string().custom(urlValidation).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});
