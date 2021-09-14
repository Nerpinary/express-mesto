const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return /^(http|https):\/\/[^ "]+$/g.test(link);
      },
      message: 'Некорректный URL',
    },
  },
});

module.exports = mongoose.model('user', userSchema);