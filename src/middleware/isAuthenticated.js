const TokenService = require("../services/token");
const { UnauthorizedError } = require("./errors");

const isAuthenticated = (req, res, next) => {
  try {
    const rawToken = req.headers.authorization;
    if (!rawToken) throw new UnauthorizedError("Unauthorized");
    const token = rawToken.replace("Bearer ", "");

    const user = TokenService.verify(token);

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isAuthenticated;
