const mongoose = require("mongoose");

const pointSchema = new mongoose.Schema({
  _id: false,
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
    validate: { validator: (arr) => arr.length === 2 },
    message: "Incorrect number of coordinates",
  },
});

module.exports = pointSchema;
