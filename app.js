require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const { DEFAULT_PORT, NOT_FOUND_MESSAGE, URL_REGEXP } = require('./utils/constants');
const users = require('./routes/users');
const { login, createUser } = require('./controllers/users');
const cards = require('./routes/card');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const errorHandler = require('./errors/error-handler');

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
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().pattern(URL_REGEXP),
  }),
}), createUser);

app.use(auth);

app.use('/users', users);
app.use('/cards', cards);
app.all('*', (req, res, next) => {
  try {
    throw new NotFoundError(NOT_FOUND_MESSAGE);
  } catch (err) {
    next(err);
  }
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {

});
