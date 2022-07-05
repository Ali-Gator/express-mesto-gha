const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const { NODE_ENV, JWT_SECRET } = process.env;
const { NOT_FOUND_MESSAGE, BAD_REQUEST_MESSAGE } = require('../utils/constants');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request');

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    if (!users) throw new NotFoundError(NOT_FOUND_MESSAGE);
    res.send(users);
  } catch (err) {
    next(err);
  }
};

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) throw new NotFoundError(NOT_FOUND_MESSAGE);
    res.send(user);
  } catch (err) {
    next(err);
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) throw new NotFoundError(NOT_FOUND_MESSAGE);
    res.send(user);
  } catch (err) {
    next(err);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const passwordHashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: passwordHashed,
    });
    if (!user) throw new BadRequestError(BAD_REQUEST_MESSAGE);
    res.send({
      name, about, avatar, email,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.patchProfile = async (req, res, next) => {
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
    if (!user) throw new BadRequestError(BAD_REQUEST_MESSAGE);
    res.send(user);
  } catch (err) {
    next(err);
  }
};

module.exports.patchAvatar = async (req, res, next) => {
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
    if (!user) throw new BadRequestError(BAD_REQUEST_MESSAGE);
    res.send(user);
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
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
      sameSite: true,
    });
    res.send(user);
  } catch (err) {
    next(err);
  }
};
