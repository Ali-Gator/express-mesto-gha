const Card = require('../models/card');
const { NOT_FOUND_MESSAGE, FORBIDDEN_MESSAGE } = require('../utils/constants');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden');

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    res.send(cards);
  } catch (err) {
    next(err);
  }
};

module.exports.postCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;

    const card = await Card.create({ name, link, owner });
    res.send(card);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId).populate('owner');
    if (!card) {
      throw new NotFoundError(NOT_FOUND_MESSAGE);
    }
    if (card.owner._id.toString() !== req.user._id) {
      throw new ForbiddenError(FORBIDDEN_MESSAGE);
    }
    await Card.findByIdAndRemove(req.params.cardId);
    res.send(card);
  } catch (err) {
    next(err);
  }
};

module.exports.putLike = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).populate(['owner', 'likes']);
    if (!card) throw new NotFoundError(NOT_FOUND_MESSAGE);
    res.send(card);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteLike = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).populate(['owner', 'likes']);
    if (!card) throw new NotFoundError(NOT_FOUND_MESSAGE);
    res.send(card);
  } catch (err) {
    next(err);
  }
};
