const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true
  },
}, { timestamps: true });

const User = mongoose.model('Users', userSchema);
module.exports = User;