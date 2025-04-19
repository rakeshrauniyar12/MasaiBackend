const mongoose = require('mongoose');

const ThemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  colors: {
    primary: {
      type: String,
      required: true
    },
    secondary: {
      type: String,
      required: true
    },
    background: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  fonts: {
    primary: {
      type: String,
      required: true
    },
    secondary: {
      type: String,
      required: true
    }
  },
  isSystemTheme: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Theme', ThemeSchema);