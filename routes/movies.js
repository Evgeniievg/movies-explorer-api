const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createMovieValidation } = require('../middlewares/validation');

const { createMovie, getMovieData, deleteMovieById } = require('../controllers/movies');

router.post('/', createMovieValidation, createMovie);

router.get('/', getMovieData);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
}), deleteMovieById);

module.exports = router;
