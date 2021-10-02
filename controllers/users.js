const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const DataError = require('../errors/data_error');
const AuthError = require('../errors/auth_error');
const ConflictError = require('../errors/conflict_error');
const NotFoundError = require('../errors/not_found_error');

const { NODE_ENV } = process.env;
const { JWT_SECRET = 'secret' } = process.env;

const getUsers = (request, response, next) => User.find({})
  .then((users) => response.status(200).send(users))
  .catch(next);

const getUser = (request, response, next) => User.findById(request.params._id)
  .orFail(new NotFoundError('Нет пользователя с таким ID'))
  .then((user) => response.status(200).send(user))
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new DataError('Введены неверные данные'));
    } else {
      next(err);
    }
  });

const createUser = (request, response, next) => {
  const {
    name, about, avatar, email, password,
  } = request.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      response.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError('Введены неверные данные'));
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new ConflictError('Данный почтовый ящик уже занят'));
      } else {
        next(err);
      }
    });
};

const login = (request, response, next) => {
  const { email, password } = request.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret', { expiresIn: '7d' },
      );
      response.cookie('jwt', token, {
        httpOnly: true,
        sameSite: true,
      }).send({ message: 'Сохранено' });
    })
    .catch(() => next(new AuthError('Неверный логин либо пароль')));
};

const updateAvatar = (request, response, next) => {
  const { avatar } = request.body;
  User.findByIdAndUpdate(request.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким ID');
      }
      return response.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new DataError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

const updateUser = (request, response, next) => {
  const { name, about } = request.body;
  User.findByIdAndUpdate(request.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким ID');
      }
      return response.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new DataError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (request, response, next) => User.findById(request.user._id)
  .orFail(new NotFoundError('Нет пользователя с таким id.'))
  .then((user) => {
    response.send({ data: user });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new DataError('Данные внесены некорректно.'));
    } else {
      next(err);
    }
  });

module.exports = {
  getUsers, getUser, createUser, updateUser, updateAvatar, login, getCurrentUser,
};
