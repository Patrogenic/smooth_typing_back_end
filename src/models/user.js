const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, maxLength: 26, unique: true },
  password: { type: String, required: true, maxLength: 100 },
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema);