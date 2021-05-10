const router = require('express').Router();
const NotFound404 = require('../errors/not-found404');

router.use((req, res, next) => {
  next(new NotFound404(`Ресурс по адресу ${req.path} не найден`));
});

module.exports = router;
