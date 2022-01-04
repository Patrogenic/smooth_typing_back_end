const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const typingTestSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  typedText: { type: Array, required: true },
  wpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  time: { type: Number, required: true },
})

typingTestSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('TypingTest', typingTestSchema);