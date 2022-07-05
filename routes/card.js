const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, postCard, deleteCard, putLike, deleteLike,
} = require('../controllers/card');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    // eslint-disable-next-line no-useless-escape
    link: Joi.string().pattern(/^https?:\/\/[www\.]?[\dA-Za-z\-\._~:\/\?#\[\]@!\$&'\(\)\*\+,;=]+/i).required(),
  }),
}), postCard);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).required(),
  }),
}), deleteCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).required(),
  }),
}), putLike);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).required(),
  }),
}), deleteLike);

module.exports = router;
