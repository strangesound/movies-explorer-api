const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const DuplicateError409 = require('../errors/duplicate-error409');
const IncorrectTokenError401 = require('../errors/incorrect-token-error401');
const NotFound404 = require('../errors/not-found404');
const ValidationError400 = require('../errors/validation-error400');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => next(err));
};

module.exports.getUsersById = (req, res, next) => {
  const { usersId } = req.params;
  User.findById(usersId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(new NotFound404('Нет пользователя с таким id'));
        // res.status(404).send({ message: 'Нет пользователя с таким id' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError400('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  // const data = { ...req.body };
  // console.log('createUser', data);

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash, // записываем хеш в базу
    }))
    .then((user) => res.status(201).send({ data: user.toJSON() }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new DuplicateError409('Такой email уже занят'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError400('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

// update user
module.exports.updateUser = (req, res, next) => {
  const { name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name },
    { new: true, runValidators: true },
  ).orFail(() => {
    next(new NotFound404('Не получилось обновить данные'));
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError400('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

// update avatar
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  ).orFail(() => {
    next(new NotFound404('Не получилось обновить данные'));
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError400('Переданы некорректные данные при создании аватара.'));
      } else if (err.statusCode === 404) {
        next(new NotFound404('Не получилось обновить данные'));
      } else {
        next(err);
      }
    });
};

// controllers/users.js

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );

      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      if (err.status !== 500) {
        next(new IncorrectTokenError401('Некоректный пароль'));
      } else {
        next(err);
      }
    });
};

// getCurrentUserById
module.exports.getCurrentUserById = (req, res, next) => {
  const usersId = req.user._id;
  User.findById(usersId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(new NotFound404('Нет пользователя с таким id'));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError400('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};
