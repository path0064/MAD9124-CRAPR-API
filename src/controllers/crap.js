const User = require("../models/userSchema.js");
const crapService = require("../services/crap.js");

const getAll = async (_req, res, next) => {
  try {
    let craps = await crapService.getAll();
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
    console.log("REQ.USER:", req.user);
    req.body.owner = req.user.id;
    const newCrap = await crapService.createOne(req.body);

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
    const updated = await crapService.updateOne(req.params.id, req.body);
    res.status(200).json({ data: updated });
  } catch (error) {
    next(error);
  }
};

const replaceOne = async (req, res, next) => {
  try {
    const replaced = await crapService.replaceOne(req.params.id, req.body);
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
};
