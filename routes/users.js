const router = require('express').Router();
const {
  validateAuthorization,
  validateNameAbout,
  // validateUserObjectIdAuth,
} = require('../middlewares/validatons');

// const User = require('../models/user');
const {
  updateUser, getCurrentUserById,
} = require('../controllers/users');
// const {
//   getUsers, getUsersById, updateUser, updateAvatar, getCurrentUserById,
// } = require('../controllers/users');

// GET /users/me - возвращает информацию о текущем пользователе

// router.get('/', validateAuthorization, getUsers);
router.get('/me', validateAuthorization, getCurrentUserById);
// router.get('/:usersId', validateUserObjectIdAuth, getUsersById);
router.patch('/me', validateNameAbout, updateUser); // PATCH /users/me — обновляет профиль
// router.patch('/me/avatar', validateAvatarLink, updateAvatar);

module.exports = router;
