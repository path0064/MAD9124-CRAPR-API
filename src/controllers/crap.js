const suggestionSchema = require("../models/suggestionSchema.js");
const User = require("../models/userSchema.js");
const crapService = require("../services/crap.js");

const getAll = async (req, res, next) => {
  try {
    let craps = await crapService.getAll(req.body);
    res.status(200).json({ data: craps });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const foundCrap = await crapService.getOne(req.params.id);
    res.status(200).json({ data: foundCrap });
  } catch (error) {
    next(error);
  }
};

const createOne = async (req, res, next) => {
  try {
    req.sanitizedBody.owner = req.user.id;
    const newCrap = await crapService.createOne(req.sanitizedBody, req.files);

    res.status(201).json({ data: newCrap });
  } catch (error) {
    next(error);
  }
};

const isInterested = async (req, res, next) => {
  try {
    buyerId = req.user.id;
    const foundCrap = await crapService.isInterested(req.params.id, buyerId);
    res.status(201).json({ data: foundCrap });
  } catch (error) {
    next(error);
  }
};

const agreed = async (req, res, next) => {
  try {
    const buyerId = req.user.id;
    const crapId = req.params.id;
    const updatedCrap = await crapService.agreed(crapId, buyerId);
    res.status(200).json({ data: updatedCrap });
  } catch (error) {
    next(error);
  }
};

const disagree = async (req, res, next) => {
  try {
    const crapId = req.params.id;
    const buyerId = req.user.id;

    const updatedCrap = await crapService.disagree(crapId, buyerId);
    res.status(200).json({ data: updatedCrap });
  } catch (error) {
    next(error);
  }
};

const reset = async (req, res, next) => {
  try {
    const crapId = req.params.id;
    const userId = req.user.id;

    const updatedCrap = await crapService.reset(crapId, userId);
    res.status(200).json({ data: updatedCrap });
  } catch (error) {
    next(error);
  }
};

const flushed = async (req, res, next) => {
  try {
    const crapId = req.params.id;
    const ownerId = req.user.id;

    const updatedCrap = await crapService.flushed(crapId, ownerId);
    res.status(200).json({ data: updatedCrap });
  } catch (error) {
    next(error);
  }
};

const suggestion = async (req, res, next) => {
  try {
    const foundCrap = await crapService.suggestion(
      req.params.id,
      req.body.suggestion
    );

    res.status(201).json({ data: foundCrap });
  } catch (error) {
    next(error);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const deleted = await crapService.deleteOne(req.params.id);
    res.status(200).json({ data: deleted });
  } catch (error) {
    next(error);
  }
};

const updateOne = async (req, res, next) => {
  try {
    const updated = await crapService.updateOne(
      req.params.id,
      req.sanitizedBody
    );
    res.status(200).json({ data: updated });
  } catch (error) {
    next(error);
  }
};

const replaceOne = async (req, res, next) => {
  try {
    const replaced = await crapService.replaceOne(
      req.params.id,
      req.sanitizedBody
    );
    res.status(200).json({ data: replaced });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getOne,
  deleteOne,
  createOne,
  updateOne,
  replaceOne,
  isInterested,
  agreed,
  disagree,
  flushed,
  suggestion,
  reset,
};
