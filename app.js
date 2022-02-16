const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login } = require('./controllers/users');
const { createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not_found_error');
const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'localhost:3000',
  'https://nerpinary.nomoredomains.club',
  'http://nerpinary.nomoredomains.club'
];

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(helmet());
app.use(cookieParser());

app.use((request, response, next) => {
  request.user = {
    _id: '620d47d95da04d2b46620f54',
  };

  next();
});

app.use(function (req,res,next) {
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную

// Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";

// Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
  }
  next();
})

app.use(function(req, res, next) {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }
  next();
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[a-zA-Z\d\-.]{1,}\.[a-z]{1,6}([/a-z0-9\-._~:?#[\]@!$&'()*+,;=]*)/),
  }),
}), createUser);

app.use(auth);

app.use('/', userRouter);
app.use('/', cardsRouter);
app.use('*', () => { throw new NotFoundError('Запрашиваемый ресурс не найден.'); });

app.use(errors());
app.use((err, request, response, next) => {
  const { statusCode = 500, message } = err;
  response.status(statusCode).send({
    message: statusCode === 500 ? 'Ошибка на сервере' : message,
  });
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Приложение подключено к порту ${PORT}`);
});
