const { raw } = require("express");
const TokenService = require("../services/token");
const { UnauthorizedError } = require("./errors");

const isAuthenticated = (req, res, next) => {
  try {
    console.log("headers:", req.headers);
    const rawToken = req.headers.authorization;

    console.log("rawToken", rawToken);

    if (!rawToken) throw new UnauthorizedError("Unauthorized");

    const token=rawToken.startsWith("Bearer")
      ? rawToken.slice(7)
      :rawToken;
    console.log("Extracted token", token);

    console.log("token", token);

    const user = TokenService.verify(token);
    console.log("user", user);

    console.log("user", user);

    req.user = user;
    next();
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

module.exports = isAuthenticated;