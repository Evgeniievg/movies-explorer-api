const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { createMovie, getCardData, deleteMovieById } = require('../controllers/movies');

router.post('/', createMovie);

router.get('/', getCardData);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
}), deleteMovieById);

module.exports = router;
