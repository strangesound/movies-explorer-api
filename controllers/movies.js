// const DuplicateError409 = require('../errors/duplicate-error409');
// const IncorrectTokenError401 = require('../errors/incorrect-token-error401');
const NotFound404 = require('../errors/not-found404');
const NotYourMovieError403 = require('../errors/not-your-movie-error403');
const ValidationError400 = require('../errors/validation-error400');

const Movie = require('../models/movie');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError400('Переданы некорректные данные при создании movie'));
      } else { // так выполнится только один next
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  // const { movieId } = req.params;
  console.log('параметры запроса', req);
  return Movie.findOne({ movieId: req.params.movieId })
    .then((movie) => {
      console.log('найденный фильм', movie);
      if (!movie) {
        next(new NotFound404('Нет такого фильма'));
      } else if (!movie.owner.equals(req.user._id)) {
        next(new NotYourMovieError403('Нельзя удалять чужие фильмы'));
      } else {
        Movie.findByIdAndRemove(movie._id, { new: true, runValidators: true })
          .then((movie2) => {
            if (movie2) {
              res.send(JSON.parse('{"movieDelete":"Фильм удален!"}'));
            } else {
              next(new NotFound404('Нет такого фильма'));
            }
          })
          .catch((err) => {
            next(err);
          });
      }
    });
};

module.exports.createMovie = (req, res, next) => {
  const data = req.body;
  data.owner = req.user._id;
  console.log(data);
  Movie.create(data)
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError400('Переданы некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

module.exports.likeMovie = (req, res, next) => Movie.findByIdAndUpdate(
  req.params.movieId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true, runValidators: true },
)
  .then((movie) => {
    if (movie) {
      // res.send(JSON.parse('{"like":"Лайк поставлен!"}'));
      res.send(movie);
    } else {
      next(new NotFound404('Нет такой movie'));
    }
  })
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new ValidationError400('Переданы некорректные данные для постановки/снятия лайка'));
    } else {
      next(err);
    }
  });

module.exports.dislikeMovie = (req, res, next) => Movie.findByIdAndUpdate(
  req.params.movieId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true, runValidators: true },
)
  .then((movie) => {
    if (movie) {
      // res.send(JSON.parse('{"like":"Лайк убран!"}'));
      res.send(movie);
    } else {
      next(new NotFound404('Нет movie по заданному id'));
      // res.status(404).send('Карточка с указанным _id не найдена.');
    }
  })
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new ValidationError400('Переданы некорректные данные для постановки/снятия лайка'));
    } else {
      next(err);
    }
  });
