const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  bio: String,
  skills: [String],
  socialLinks: {
    website: String,
    github: String,
    linkedin: String,
    twitter: String,
    dribbble: String,
    behance: String,
  },
  selectedTheme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theme",
  },
  customTheme: {
    colors: {
      primary: String,
      secondary: String,
      background: String,
      text: String,
    },
    fonts: {
      primary: String,
      secondary: String,
    },
  },
  published: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Portfolio", PortfolioSchema);
