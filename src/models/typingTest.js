const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const typingTestSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  typedText: { type: Array, required: true },
})

module.exports = mongoose.model('TypingTest', typingTestSchema);