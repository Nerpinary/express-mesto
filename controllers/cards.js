/* eslint-disable eol-last */
/* eslint-disable no-undef */
/* eslint-disable no-console */
const Card = require('../models/card');

const DataError = require('../errors/data_error');
const AccessDeniedError = require('../errors/access_denied_error');
const NotFoundError = require('../errors/not_found_error');
const ServerError = require('../errors/server_error');

const getCards = (request, response, next) => {
  Card.find({})
    .then((card) => {
      response.send(card);
    })
    .catch(next);
};

const getCard = async (request, response) => {
  const { _id } = request.params;

  try {
    const card = await Card.findById(_id);

    if (!card) {
      throw new NotFoundError(`Карточка с id: ${_id} не найдена`);
    }

    response.status(200).send(card);
  } catch (err) {
    console.error(err);

    if (err.name === 'CastError') {
      // eslint-disable-next-line no-undef
      next(new DataError(`Произошла ошибка ${err.name}`));
      return;
    }

    next(ServerError('Ошибка на сервере'));
  }
};

const createCard = (request, response, next) => {
  const { name, link } = request.body;
  Card.create({ name, link, owner: request.user._id })
    .then((card) => {
      response.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(DataError('Введены неверные данные'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (request, response, next) => {
  const { _id } = request.params;
  Card.findById(_id)
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => {
      if (card.owner.equals(request.user._id)) {
        Card.findByIdAndRemove(_id)
          .then((result) => {
            response.send(result);
          });
      } else {
        throw new AccessDeniedError('Вы не обладаете правами для удаления карточки');
      }
    })
    .catch(next);
};

const likeCard = (request, response, next) => {
  Card.findByIdAndUpdate(
    request.params._id, {
      $addToSet: { likes: request.user._id },
    }, { new: true },
  )
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => {
      response.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new DataError('Введены неверные данные'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (request, response, next) => {
  Card.findByIdAndUpdate(
    request.params._id,
    {
      $pull: { likes: request.user._id },
    },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => {
      response.send(card);
    })
    .catch((err) => {
      if (err.message === 'CastError') {
        next(new DataError('Введены неверные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCard, getCards, createCard, deleteCard, likeCard, dislikeCard,
};