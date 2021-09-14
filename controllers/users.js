const User = require('../models/user');

module.exports.getUsers = async (request, response) => {
  try {
    const users = await User.find({});

    response.status(200).send(users);

  } catch(err) {
    console.error(`Oops: ${err.name}`);
    console.error(`Oops: ${err.message}`);

    response.status(500).send({message: '500 ошибка на сервере'});
  }
};

module.exports.getUser = async (request, response) => {
  const {_id} = request.params;

  try {
    const user = await User.findById(_id);

    if (!user) {
      response.status(404).send({message: `Пользователь с id: ${_id} не найден`});
      return;
    }

    response.status(200).send(user);

  } catch(err) {
    console.error(`Oops: ${err.name}`);
    console.error(`Oops: ${err.message}`);

    if (err.name === 'CastError') {
      response.status(404).send({message: `Пользователь с id: ${_id} не найден`});

      console.error(`Oops: ${err.message}`);
      return;
    }

    response.status(500).send({message: '500 ошибка на сервере'});
  }
};

module.exports.createUser = async (request, response) => {
  try {
    const {name, about, avatar} = request.body;

    console.log(request);
    console.log(name, about, avatar);

    const user = await User.create({name, about, avatar});

    response.status(200).send(user);

  } catch(err) {
    console.error(err);
    console.error(`Oops: ${err.name}`);
    console.error(`Oops: ${err.message}`);

    if (err.name === 'ValidationError') {
      response.status(400).send({message: 'Введены некорректные данные'});
      return;
    }

    response.status(500).send({message: '500 ошибка на сервере'});
  }
};

module.exports.updateAvatar = (request, response) => {
  try {
    const {avatar} = request.body;

    User.findByIdAndUpdate(request.user._id, {avatar}, {new: true, runValidators: true});

    response.status(200).send({message: 'Ok'});
  } catch (err) {
    console.error(err);
    console.error(`Oops: ${err.name}`);
    console.error(`Oops: ${err.message}`);

    if (err.name === 'ValidationError' || err.name === 'CastError') {
      response.status(400).send({message: 'Введены некорректные данные'});
      return;
    }

    response.status(500).send({message: '500 ошибка на сервере'});
  }
};

module.exports.updateProfile = (request, response) => {
  try {
    const { name, about } = request.body;

    User.findByIdAndUpdate(request.user._id, { name, about }, { new: true, runValidators: true });

    response.status(200).send({message: 'Ok'});
  } catch (err) {
    console.error(err);

    if (err.name === 'ValidationError' || err.name === 'CastError') {
      response.status(400).send({message: 'Введены некорректные данные'});
      return;
    }

    response.status(500).send({message: '500 ошибка на сервере'});
  }
};
