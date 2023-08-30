const { celebrate, Joi } = require('celebrate');

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
