const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [2, 'Too short length of name'],
    maxLength: [30, 'Too long length of name'],
  },
  link: {
    type: String,
    required: [true, 'Link required'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Owner required'],
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
