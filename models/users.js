const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [2, 'Too short length of name'],
    maxLength: [30, 'Too long length of name'],
  },
  about: {
    type: String,
    required: true,
    minLength: [2, 'Too short length of name'],
    maxLength: [30, 'Too long length of name'],
  },
  avatar: {
    type: String,
    required: [true, 'Avatar required'],
  },
});

module.exports = mongoose.model('user', userSchema);
