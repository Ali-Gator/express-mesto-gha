const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const users = require('./routes/users');
const cards = require('./routes/card');
const { DEFAULT_PORT, NOT_FOUND_ERR, NOT_FOUND_MESSAGE } = require('./utils/constants');

const { PORT = DEFAULT_PORT } = process.env;
const app = express();

process.on('uncaughtException', (err, origin) => {
  console.log(`${origin} ${err.name} with text ${err.message} doesn't catch. Look at this!`);
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}).catch((error) => console.log(error));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '62ae17b5b1124cdfe5ccdd39',
  };
  next();
});

app.use('/users', users);
app.use('/cards', cards);

app.use((req, res) => {
  res.status(NOT_FOUND_ERR).send({ message: NOT_FOUND_MESSAGE });
});

app.listen(PORT, () => {

});
