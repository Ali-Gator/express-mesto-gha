const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const { NODE_ENV, JWT_SECRET } = process.env;

const {
  INTERNAL_SERVER_ERROR,
  INTERNAL_SERVER_MESSAGE,
  NOT_FOUND_ERR,
  NOT_FOUND_MESSAGE, BAD_REQUEST_ERROR, BAD_REQUEST_MESSAGE, UNAUTHORIZED_ERR, UNAUTHORIZED_MESSAGE,
} = require('../utils/constants');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).send({ message: INTERNAL_SERVER_MESSAGE });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user) {
      res.send(user);
    } else {
      res.status(NOT_FOUND_ERR).send({ message: NOT_FOUND_MESSAGE });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: BAD_REQUEST_MESSAGE });
    }
    res.status(INTERNAL_SERVER_ERROR).send({ message: INTERNAL_SERVER_MESSAGE });
  }
};

module.exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.send(user);
    } else {
      res.status(NOT_FOUND_ERR).send({ message: NOT_FOUND_MESSAGE });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: BAD_REQUEST_MESSAGE });
    }
    res.status(INTERNAL_SERVER_ERROR).send({ message: INTERNAL_SERVER_MESSAGE });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    // todo check password length
    const passwordHashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: passwordHashed,
    });
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: BAD_REQUEST_MESSAGE });
    }
    res.status(INTERNAL_SERVER_ERROR).send({ message: INTERNAL_SERVER_MESSAGE });
  }
};

module.exports.patchProfile = async (req, res) => {
  try {
    const { name, about } = req.body;
    const userId = req.user._id;

    const user = await User.findOneAndUpdate(
      userId,
      { name, about },
      {
        new: true,
        runValidators: true,
        upsert: true,
      },
    );
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(NOT_FOUND_ERR).send({ message: NOT_FOUND_MESSAGE });
    }
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: BAD_REQUEST_MESSAGE });
    }
    res.status(INTERNAL_SERVER_ERROR).send({ message: INTERNAL_SERVER_MESSAGE });
  }
};

module.exports.patchAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const userId = req.user._id;

    const user = await User.findOneAndUpdate(
      userId,
      { avatar },
      {
        new: true,
        runValidators: true,
        upsert: true,
      },
    );
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(NOT_FOUND_ERR).send({ message: NOT_FOUND_MESSAGE });
    }
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: BAD_REQUEST_MESSAGE });
    }
    res.status(INTERNAL_SERVER_ERROR).send({ message: INTERNAL_SERVER_MESSAGE });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );
    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      // sameSite: true,
    });
    res.send('ok');
  } catch (err) {
    res.status(UNAUTHORIZED_ERR).send({ message: UNAUTHORIZED_MESSAGE });
  }
};
