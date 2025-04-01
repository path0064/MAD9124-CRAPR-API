const express = require("express");

const { errorHandler } = require("./middleware/errors");
const crapRouter = require("./routers/crap");
const { connect } = require("./models/db");

connect();

const app = express();

app.use(express.json());

app.use("/api/craps", crapRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`Server listening on port ${PORT}`);
});
