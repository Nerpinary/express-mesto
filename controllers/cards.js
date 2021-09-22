const Card = require('../models/card');

module.exports.getCards = async (request, response) => {
  try {
    const cards = await Card.find({});

    response.status(200).send(cards);

  } catch (err) {
    console.error(err);

    response.status(500).send({message: 'Ошибка на сервере'});
  }
};

module.exports.getCard = async (request, response) => {
  const {_id} = request.params;

  try {
    const card = await Card.findById(_id);

    if (!card) {
      response.status(404).send({message: `Карточка с id: ${_id} не найдена`});
      return;
    }

    response.status(200).send(card);

  } catch (err) {
    console.error(err);

    if (err.name === 'CastError') {
      response.status(400).send({message: `Произошла ошибка ${err.name}`});
      return;
    }

    response.status(500).send({message: 'Ошибка на сервере'});
  }
};

module.exports.createCard = async (request, response) => {
  const {name, link} = request.body;

  try {
    const card = await Card.create({name, link, owner: request.user._id});

    response.status(200).send(card);

  } catch (err) {
    console.error(err);

    if (err.name === 'ValidationError') {
      response.status(400).send({message: 'Переданы некорректные данные'});
      return;
    }
    response.status(500).send({message: 'Ошибка на сервере'});
  }
};

module.exports.deleteCard = async (request, response) => {
  try {
    const deletedCard = await Card.findById(request.params._id);

    if (!deletedCard) {
      response.status(404).send({message: `Карточка с id: ${request.params._id} не найдена`});
      return;
    }

    await Card.findByIdAndRemove(request.params._id);

    response.status(200).send({message: 'Карточка удалена'});

  } catch (err) {
    console.error(err);

    if (err.name === 'CastError') {
      response.status(400).send({message: `Произошла ошибка ${err.name}`});
      return;
    }

    response.status(500).send({message: 'Ошибка на сервере'});
  }
};

module.exports.likeCard = async (request, response) => {
  try {
    const like = await Card.findById(request.params._id);

    if (!like) {
      response.status(404).send({message: 'Произошла ошибка'});
      return;
    }

    await Card.findByIdAndUpdate(request.params._id, {$addToSet: {likes: request.user._id}}, {new: true});

    response.status(200).send({message: 'Ok'});

  } catch (err) {
    console.error(err);

    if (err.name === 'CastError') {
      response.status(400).send({message: `Произошла ошибка ${err.name}`});
      return;
    }

    response.status(500).send({message: 'Ошибка на сервере'});
  }
};

module.exports.dislikeCard = async (request, response) => {
  try {
    const dislike = await Card.findById(request.params._id);

    if (!dislike) {
      response.status(404).send({message: 'Произошла ошибка'});
      return;
    }

    await Card.findByIdAndUpdate(request.params._id, {$pull: {likes: request.user._id}}, {new: true});

    response.status(200).send({message: 'Ok'});

  } catch (err) {
    console.error(err);

    if (err.name === 'CastError') {
      response.status(400).send({message: `Произошла ошибка ${err.name}`});
      return;
    }

    response.status(500).send({message: 'Ошибка на сервере'});
  }
};