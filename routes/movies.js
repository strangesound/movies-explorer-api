const router = require('express').Router();
const {
  // validateDeleteMovie,
  validateAuthorization,
  validateMovie,
} = require('../middlewares/validatons');

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/', validateAuthorization, getMovies);
router.post('/', validateMovie, createMovie);
router.delete('/:movieId', deleteMovie);
// router.put('/:cardId/likes', validateDeleteLikeMovie, likeMovie);
// router.delete('/:cardId/likes', validateDeleteLikeMovie, dislikeMovie);

module.exports = router;
