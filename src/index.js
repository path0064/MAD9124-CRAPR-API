const express = require("express");
require("dotenv").config();

const cors = require("cors");
const { errorHandler } = require("./middleware/errors");
const crapRouter = require("./routers/crap");
const { connect } = require("./models/db");
const authRouter = require("./routers/auth");
require("./util/passport");

connect();

const app = express();

app.use(
  cors({
    origin: (process.env.CORS_ALLOWLIST || "").split(","),
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/craps", crapRouter);

app.use(errorHandler);

app.use("/auth", authRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`Server listening on port ${PORT}`);
});
