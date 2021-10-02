const jwt = require('jsonwebtoken');

const AuthError = require('../errors/auth_error');

const JWT_SECRET = 'secret';

function auth(request, response, next) {
  const token = request.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AuthError('Авторизация не удалась');
  }

  request.user = payload;

  next();
}

module.exports = auth;
