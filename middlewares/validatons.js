const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;
const validator = require('validator');

module.exports.validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.number(),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200),
  }).unknown(true),
});

module.exports.validateMovie = celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200),
  }).unknown(true),
  body: Joi.object().keys({
    country: Joi.string(),
    director: Joi.string(),
    duration: Joi.string(),
    description: Joi.string(),
    nameRU: Joi.string(),
    nameEN: Joi.string(),
    year: Joi.number(),
    movieId: Joi.string(),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('inValid link');
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('inValid link');
    }),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('inValid link');
    }),
  }),
});

module.exports.validateAuthorization = celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200),
  }).unknown(true),
});

module.exports.validateNamePasswordLogin = celebrate({
  body: Joi.object().keys({
    password: Joi.string().min(8).required(),
    email: Joi.string().email().required(),
  }),
});

module.exports.validateRegistration = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    password: Joi.string().min(8).required(),
    email: Joi.string().email().required(),
  }),
});

module.exports.validateObjectIdAuth = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('inValid ID');
    }),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200),
  }).unknown(true),
});

module.exports.validateUserObjectIdAuth = celebrate({
  params: Joi.object().keys({
    usersId: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('inValid ID');
    }),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200),
  }).unknown(true),
});

// AvatarLink
module.exports.validateAvatarLink = celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200),
  }).unknown(true),
  body: Joi.object().keys({
    avatar: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('inValid link');
    }),
  }),

});

module.exports.validateNameAbout = celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    // about: Joi.string().min(2).max(30).required(),
  }).unknown(true),

});
