const jwt = require('jsonwebtoken');
const IncorrectTokenError401 = require('../errors/incorrect-token-error401');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // console.log('authorization в модуле auth', authorization)
  if (!authorization) {
    next(new IncorrectTokenError401('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
    // console.log('payload', payload);
  } catch (err) {
    next(new IncorrectTokenError401('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
