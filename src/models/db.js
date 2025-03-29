const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/crapr");
    console.log("connected to mongoose");
  } catch (err) {
    console.log("Error connecting to mongoose: ", err);
  }
};

module.exports = {
  connect,
};
