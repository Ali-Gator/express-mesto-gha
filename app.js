require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const {
  DEFAULT_PORT,
  NOT_FOUND_ERR,
  NOT_FOUND_MESSAGE,
  BAD_REQUEST_ERROR,
  BAD_REQUEST_MESSAGE,
  CONFLICT_MESSAGE,
} = require('./utils/constants');
const users = require('./routes/users');
const { login, createUser } = require('./controllers/users');
const cards = require('./routes/card');
const auth = require('./middlewares/auth');

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
app.use(cookieParser());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', users);
app.use('/cards', cards);
app.all('*', (req, res) => {
  res.status(NOT_FOUND_ERR).send({ message: NOT_FOUND_MESSAGE });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const {
    statusCode = 500, message, name, code,
  } = err;

  if (code === 11000) {
    return res.status(409).send({ message: CONFLICT_MESSAGE });
  }

  switch (name) {
    case 'CastError':
      res.status(BAD_REQUEST_ERROR).send({ message: BAD_REQUEST_MESSAGE });
      break;
    case 'ValidationError':
      res.status(BAD_REQUEST_ERROR).send({ message: BAD_REQUEST_MESSAGE });
      break;
    default:
      res.status(statusCode).send({
        message: statusCode === 500
          ? 'Server error'
          : message,
      });
  }
});

app.listen(PORT, () => {

});
