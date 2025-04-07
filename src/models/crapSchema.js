const mongoose = require("mongoose");
const pointSchema = require("./pointSchema");
const suggestionSchema = require("./suggestionSchema");

const crapSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 250,
    },
    description: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 255,
    },
    location: {
      type: pointSchema,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      enum: ["AVAILABLE", "INTERESTED", "SCHEDULED", "AGREED", "FLUSHED"],
      required: true,
      default: "AVAILABLE",
    },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    buyer: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: false,
    },
    suggestion: {
      type: suggestionSchema,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Crap = mongoose.model("Crap", crapSchema);

// const newCrap = new Crap({
//   title: "bag",
//   description: "lorem ipsem lorem ipsem lorem ipsem lorem ipsem",
//   images: "https://picsum.photos/200",
//   location: {
//     type: "Point",
//     coordinates: [-109, 41],
//   },
//   status: "null",
//   suggestion: {
//     address: "bla blah blah",
//     date: "29/03/2025",
//     time: "10:29",
//   },
// });
// newCrap.save();

module.exports = Crap;
