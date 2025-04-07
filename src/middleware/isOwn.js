const { ForbiddenError } = require("./errors");
const Craps = require("../models/crapSchema");

const validateOwner = async (req, _, next) => {
  try {
    const crp = await Craps.findById(req.params.id);
    if (crp) {
      if (!crp.owner.equals(req.user.id)) {
        throw new ForbiddenError();
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

const validateBuyer = async (req, _, next) => {
  try {
    const crp = await Craps.findById(req.params.id);
    if (crp) {
      if (!crp.buyer.equals(req.user.id)) {
        throw new ForbiddenError();
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { validateOwner, validateBuyer };
