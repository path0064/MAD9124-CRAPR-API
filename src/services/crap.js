const {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} = require("../middleware/errors");
const Craps = require("../models/crapSchema");

const getAll = async ({ query, lat, long, distance, show_taken }) => {
  const filter = {};

  if (query) filter.$text = { $search: query };

  if (lat && long) {
    filter.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(long), parseFloat(lat)],
        },
        $maxDistance: parseInt(distance),
      },
    };
  }

  filter.status = show_taken === "true" ? { $ne: "FLUSHED" } : "AVAILABLE";

  const craps = await Craps.find(filter)

    .select("-location -buyer -suggestion")
    .populate("owner", "name");

  return craps;
};

const getOne = async (id) => {
  const foundCrap = await Craps.findById(id);
  if (!foundCrap) throw new NotFoundError(`crap with id ${id} not found`);
  return foundCrap;
};

const createOne = async (body) => {
  const { title, description, location, images, owner } = body;
  const newCrap = new Craps({
    title: title,
    description: description,
    location: location,
    images: images,
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

const reset = async (id) => {
  const crap = await Craps.findById(id);

  if (crap.status === "FLUSHED") {
    throw new BadRequestError(`Cannot reset when status is ${crap.status}`);
  }
  crap.status = "AVAILABLE";
  crap.suggestion = undefined;
  crap.buyer = undefined;
  await crap.save();
  return crap;
};

const deleteOne = async (id) => {
  const deleted = await Craps.findByIdAndDelete(id);
  if (!deleted) throw new NotFoundError(`crap with id ${id} not found`);

  return deleted;
};

const updateOne = async (id, body) => {
  const updated = await Craps.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  if (!updated) throw new NotFoundError(`crap with id ${id} not found`);
  return updated;
};

const replaceOne = async (id, body) => {
  const replaced = await Craps.findOneAndReplace({ _id: id }, body, {
    new: true,
    runValidators: true,
  });

  if (!replaced) throw new NotFoundError(`crap with id ${id} not found`);

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
};
