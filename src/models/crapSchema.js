const mongoose = require("mongoose");

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
    // location: {
    //   type: Point,
    //   required: true,
    // },
    images: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    // owner: {
    //   type: mongoose.SchemaTypes.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    // buyer: {
    //   type: mongoose.SchemaTypes.ObjectId,
    //   ref: "User",
    //   required: false,
    // },
    // suggestion: {
    //   type: Suggestion,
    //   required: false,
    // },
  },
  {
    timestamps: true,
  }
);

const Crap = mongoose.model("Crap", crapSchema);
const newCrap = new Crap({
  court: { name: "PillowFightz", count: 2 },
  title: "bag",
  description: "lorem ipsem lorem ipsem lorem ipsem lorem ipsem",
  images: "https://picsum.photos/200",
  status: "null",
});
await newCrap.save();
module.exports = Crap;
