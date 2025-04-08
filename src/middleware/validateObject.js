const { isValidObjectId } = require("mongoose");
const { BadRequestError } = require("./errors");

const validObjectId = (req, _, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      throw new BadRequestError("Invalid id");
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validObjectId;
