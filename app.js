const express = require('express');
const router = require('./routes/router');
const mongoose = require('mongoose');
const MongoClient = require('mongodb');

const app = express();
const {PORT = 3000} = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

app.use((request, response, next) => {
  request.user = {
    _id: "614b4f409712c41a100ece46",
  };

  next();
});

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/', router);

app.listen(PORT, () => {
  console.log(`Приложение подключено к порту ${PORT}`);
});