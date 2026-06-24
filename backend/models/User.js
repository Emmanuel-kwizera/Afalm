const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide a full name']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide a phone number']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 8,
    select: false // Do not return password by default
  },
  mainCrop: {
    type: String
  },
  role: {
    type: String,
    enum: ['farmer', 'admin'],
    default: 'farmer'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
