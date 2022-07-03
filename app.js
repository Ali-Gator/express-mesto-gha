require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { DEFAULT_PORT, NOT_FOUND_ERR, NOT_FOUND_MESSAGE } = require('./utils/constants');
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

app.listen(PORT, () => {

});
