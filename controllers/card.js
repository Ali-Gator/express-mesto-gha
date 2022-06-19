const Card = require('../models/card');
const {
  BAD_REQUEST_ERROR,
  BAD_REQUEST_MESSAGE,
  INTERNAL_SERVER_ERROR,
  INTERNAL_SERVER_MESSAGE, NOT_FOUND_ERR, NOT_FOUND_MESSAGE,
} = require('../utils/constants');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    res.status(200).send(cards);
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).send({ message: INTERNAL_SERVER_MESSAGE });
  }
};

module.exports.postCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;

    const card = await Card.create({ name, link, owner });
    res.status(200).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: BAD_REQUEST_MESSAGE });
    }
    res.status(INTERNAL_SERVER_ERROR).send({ message: INTERNAL_SERVER_MESSAGE });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    await Card.findByIdAndRemove(req.params.cardId);
    res.status(200).send({ message: 'Post successfully deleted' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(NOT_FOUND_ERR).send({ message: NOT_FOUND_MESSAGE });
    }
    res.status(INTERNAL_SERVER_ERROR).send({ INTERNAL_SERVER_MESSAGE });
  }
};

module.exports.putLike = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).populate(['owner', 'likes']);
    res.status(200).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(NOT_FOUND_ERR).send({ message: NOT_FOUND_MESSAGE });
    }
    res.status(INTERNAL_SERVER_ERROR).send({ message: INTERNAL_SERVER_MESSAGE });
  }
};

module.exports.deleteLike = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).populate(['owner', 'likes']);
    res.status(200).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(NOT_FOUND_ERR).send({ message: NOT_FOUND_MESSAGE });
    }
    res.status(INTERNAL_SERVER_ERROR).send({ message: INTERNAL_SERVER_MESSAGE });
  }
};
