const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema({
  _id: false,
  address: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 255,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

module.exports = suggestionSchema;
