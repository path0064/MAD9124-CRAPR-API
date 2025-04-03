const Craps = require("../models/crapSchema");
const {NotFoundError} = require("../middleware/errors");

const getAll = async () => {
  const craps = await Craps.find({});
  return craps;
};

const getOne = async (id) => {
  const foundCrap = await Craps.findById(id);

  if (!foundCrap) throw new NotFoundError(`crap with id ${id} not found`);
  return foundCrap;
};

const createOne = async (body) => {
  const { title, description, location, images, status } = body;
  const newCrap = new Craps({
    title: title,
    description: description,
    location: location,
    images: images,
    status: status,
  });
  await newCrap.save();
  return newCrap;
};

const deleteOne = async (id) => {
  const deleted = await Craps.findByIdAndDelete(id);
  if (!deleted) throw new NotFoundError(`crap with id ${id} not found`);

  return deleted;
};

const updateOne = async (id, body) => {
  const updated = await Craps.findByIdAndUpdate(id, body, { 
    new: true,
    runValidators: true
  });

  if (!updated) throw new NotFoundError(`crap with id ${id} not found`);
  return updated;
}

const replaceOne = async (id,body) => {
  const replaced=await Craps.findOneAndReplace({_id:id}, body,{
    new:true,
    runValidators:true
  });

  if(!replaced) throw new NotFoundError(`crap with id ${id} not found`);

  return replaced;
}

module.exports = {
  getAll,
  getOne,
  deleteOne,
  createOne,
  updateOne,
  replaceOne
};
