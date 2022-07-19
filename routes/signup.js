const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { URL_REGEXP } = require('../utils/constants');
const { createUser } = require('../controllers/users');

router.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().pattern(URL_REGEXP),
  }),
}), createUser);

module.exports = router;
