const mongoose = require('mongoose');
const { URL_REGEXP } = require('../utils/constants');

const cardSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      // eslint-disable-next-line no-useless-escape
      validator: (v) => URL_REGEXP.test(v),
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

cardSchema.post('save', (doc, next) => {
  doc.populate(['owner', 'likes']).then(() => {
    next();
  });
});

module.exports = mongoose.model('card', cardSchema);
