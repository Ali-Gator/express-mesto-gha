const User = require('../models/users');
const {
  INTERNAL_SERVER_ERROR,
  INTERNAL_SERVER_MESSAGE,
  NOT_FOUND_ERR,
  NOT_FOUND_MESSAGE, BAD_REQUEST_ERROR, BAD_REQUEST_MESSAGE,
} = require('../utils/constants');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).send({ message: INTERNAL_SERVER_MESSAGE });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(NOT_FOUND_ERR).send({ message: NOT_FOUND_MESSAGE });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: BAD_REQUEST_MESSAGE });
    }
    res.status(INTERNAL_SERVER_ERROR).send({ INTERNAL_SERVER_MESSAGE });
  }
};

module.exports.postUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;

    const user = await User.create({ name, about, avatar });
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: BAD_REQUEST_MESSAGE });
    }
    res.status(INTERNAL_SERVER_ERROR).send({ INTERNAL_SERVER_MESSAGE });
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
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(NOT_FOUND_ERR).send({ message: NOT_FOUND_MESSAGE });
    }
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: BAD_REQUEST_MESSAGE });
    }
    res.status(INTERNAL_SERVER_ERROR).send({ INTERNAL_SERVER_MESSAGE });
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
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(NOT_FOUND_ERR).send({ message: NOT_FOUND_MESSAGE });
    }
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: BAD_REQUEST_MESSAGE });
    }
    res.status(INTERNAL_SERVER_ERROR).send({ INTERNAL_SERVER_MESSAGE });
  }
};
