const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');
const { validateNamePasswordLogin, validateAuthorization, validateRegistration } = require('./middlewares/validatons');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000000000000000000,
});
//  apply to all requests
app.use(limiter);
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  autoIndex: true,
});

app.use(requestLogger); // подключаем логгер запросов

app.use(cors());

// app.get('/', function (req, res, next) {
//   res.json({ msg: 'This is CORS-enabled for all origins!' });
// });

// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

app.post('/signup', validateRegistration, createUser);
app.post('/signin', validateNamePasswordLogin, login); // проверить имя и почту

app.use(validateAuthorization, auth);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));
app.use('*', require('./routes/index'));

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
