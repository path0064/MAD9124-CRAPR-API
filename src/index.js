const express = require("express");
const { connect } = require("./models/db");

connect();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 4000;
app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`Server listening on port ${PORT}`);
});
