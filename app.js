require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { DEFAULT_PORT } = require('./utils/constants');
const users = require('./routes/users');
const cards = require('./routes/card');
const signin = require('./routes/signin');
const signup = require('./routes/signup');
const any = require('./routes/any');
const auth = require('./middlewares/auth');
const cors = require('./middlewares/cors');
const errorHandler = require('./errors/error-handler');
// const handleUncaughtException = require('./errors/uncaught-exception');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = DEFAULT_PORT } = process.env;
const app = express();

// process.on('uncaughtException', handleUncaughtException);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}).catch((error) => console.log(error));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);
app.use(cors);

// todo delete after test
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/signin', signin);
app.use('/signup', signup);

app.use(auth);

app.use('/users', users);
app.use('/cards', cards);
app.use('*', any);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
});
