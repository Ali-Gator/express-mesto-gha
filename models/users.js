const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { UNAUTHORIZED_MESSAGE } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Not valid email address', // todo need check
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

userSchema.statics.findUserByCredentials = async function findUserByCredentials(email, password) {
  const user = await this.findOne({ email });
  console.log('email', email);
  if (!user) {
    throw new Error(UNAUTHORIZED_MESSAGE);
  }
  const isMatched = bcrypt.compare(password, user.password);
  if (!isMatched) {
    throw new Error(UNAUTHORIZED_MESSAGE);
  }
  return user;
};

module.exports = mongoose.model('user', userSchema);
