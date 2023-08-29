const Movie = require('../models/movie');
const NotFoundError = require('../utils/not-found-error');
const BadRequest = require('../utils/bad-request-error');
const ForbiddenError = require('../utils/forbidden-error');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create(
    {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner: req.user._id,
    },
  )
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Ошибка валидации фильма'));
        return;
      }
      next(err);
    });
};

module.exports.getCardData = (req, res, next) => {
  const ownerId = req.user._id;
  Movie.find({ owner: ownerId })
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

module.exports.deleteMovieById = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('Фильм не найден'));
        return;
      }
      if (req.user._id.toString() !== movie.owner.toString()) {
        next(new ForbiddenError('Нет прав на удаление фильма'));
        return;
      }
      Movie.deleteOne(movie)
        .then((removedMovie) => res.send({ data: removedMovie }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Фильм не найден'));
        return;
      }
      next(err);
    });
};
