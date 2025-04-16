const {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} = require("../middleware/errors");
const imageService = require("./images");
const Craps = require("../models/crapSchema");
const { use } = require("passport");

const getAll = async ({ query, lat, long, distance, show_taken }) => {
  const filter = {};
  filter.location = {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [parseFloat(long), parseFloat(lat)],
      },
      $maxDistance: parseInt(distance),
    },
  };

  let crapResult = [];

  const regexQuery = new RegExp(query, "i");

  if (show_taken && show_taken === "true") {
    crapResult = await Craps.find(filter)
      .or([
        { title: { $regex: regexQuery } },
        { description: { $regex: regexQuery } },
      ])
      .where("status")
      .in(["AVAILABLE", "INTERESTED", "SCHEDULED", "AGREED"])

      .populate({ path: "owner", select: "-googleId" });
  } else {
    crapResult = await Craps.find(filter)
      .or([
        { title: { $regex: regexQuery } },
        { description: { $regex: regexQuery } },
      ])
      .where({ status: "AVAILABLE" })

      .populate({ path: "owner", select: "-googleId" });
  }
  return crapResult;
};

const getOne = async (id, userId) => {
  const foundCrap = await Craps.findById(id)
    .populate({
      path: "owner",
      select: "name",
    })
    .populate({ path: "buyer", select: "name" });
  if (!foundCrap) throw new NotFoundError(`crap with id ${id} not found`);

  const crapResult = foundCrap.toObject();

  if (
    userId !== crapResult.buyer?._id.toString() &&
    userId !== crapResult.owner?._id.toString()
  ) {
    delete crapResult.location;
    delete crapResult.buyer;
    delete crapResult.suggestion;
  }

  return crapResult;
};

const getMine = async (userId) => {
  const foundCrap = await Craps.find({
    $or: [{ owner: userId }, { buyer: userId }],
  }).populate({ path: "owner buyer", select: "-googleId" });

  return foundCrap;
};

const createOne = async (body, files) => {
  const urls = await imageService.uploadMany(files);

  const { title, description, lat, long, owner } = body;
  const newCrap = new Craps({
    title: title,
    description: description,
    location: {
      type: "Point",
      coordinates: [long, lat],
    },
    images: urls,
    status: "AVAILABLE",
    owner,
  });
  await newCrap.save();
  return newCrap;
};

const isInterested = async (id, buyerId) => {
  const foundCrap = await Craps.findById(id);
  if (foundCrap.status !== "AVAILABLE") {
    throw new BadRequestError(`This item is currently unavailable.`);
  } else {
    foundCrap.status = "INTERESTED";
    foundCrap.buyer = buyerId;
  }
  await foundCrap.save();

  return foundCrap;
};

const suggestion = async (id, suggestions) => {
  const foundCrap = await Craps.findById(id);
  if (foundCrap.status !== "INTERESTED") {
    throw new BadRequestError("This item has not been marked as interested");
  } else {
    foundCrap.status = "SCHEDULED";
    foundCrap.suggestion = {
      address: suggestions.address,
      date: suggestions.date,
      time: suggestions.time,
    };
  }
  await foundCrap.save();

  return foundCrap;
};

const agreed = async (id) => {
  const crap = await Craps.findById(id);
  if (crap.status !== "SCHEDULED") {
    throw new BadRequestError(`Can only agree to a scheduled crap`);
  } else {
    crap.status = "AGREED";
  }
  await crap.save();
  return crap;
};

const disagree = async (id) => {
  const crap = await Craps.findById(id);

  if (crap.status !== "SCHEDULED") {
    throw new BadRequestError(`Can only disagree with a scheduled crap`);
  }

  crap.status = "INTERESTED";
  crap.suggestion = undefined;
  await crap.save();
  return crap;
};

const flushed = async (id) => {
  const crap = await Craps.findById(id);

  if (crap.status !== "AGREED") {
    throw new BadRequestError(`Can only flush an agreed crap`);
  }

  crap.status = "FLUSHED";
  await crap.save();
  return crap;
};

const reset = async (id, userId) => {
  const crap = await Craps.findById(id);

  if (crap.status === "FLUSHED") {
    throw new BadRequestError(`Cannot reset when status is ${crap.status}`);
  }
  if (userId !== crap.buyer.toString() && userId !== crap.owner.toString()) {
    console.log([crap.owner, crap.owner]);
    throw new ForbiddenError("Only the buyer or seller can reset the crap");
  }
  crap.status = "AVAILABLE";
  crap.suggestion = undefined;
  crap.buyer = undefined;
  await crap.save();
  return crap;
};

const deleteOne = async (id) => {
  const deleted = await Craps.findByIdAndDelete(id).populate({
    path: "owner",
    select: "name",
  });
  if (!deleted) throw new NotFoundError(`crap with id ${id} not found`);

  return deleted;
};

const updateOne = async (id, body, files) => {
  if (Array.isArray(files) && files.length) {
    body.images = await imageService.uploadMany(files);
  }
  const updated = await Craps.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  }).populate({ path: "owner", select: "name" });

  if (!updated) throw new NotFoundError(`crap with id ${id} not found`);
  await updated.save();
  return updated;
};

const replaceOne = async (id, body, files) => {
  const urls = await imageService.uploadMany(files);
  const replaced = await Craps.findOneAndReplace(
    { _id: id },
    {
      ...body,
      images: urls,
      location: {
        type: "Point",
        coordinates: [body.long, body.lat],
      },
    },
    {
      new: true,
      runValidators: true,
    }
  ).populate({ path: "owner", select: "name" });

  if (!replaced) throw new NotFoundError(`crap with id ${id} not found`);
  await replaced.save();
  return replaced;
};

module.exports = {
  getAll,
  getOne,
  deleteOne,
  createOne,
  updateOne,
  replaceOne,
  isInterested,
  suggestion,
  agreed,
  disagree,
  flushed,
  reset,
  getMine,
};
