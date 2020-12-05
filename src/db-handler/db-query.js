//'use strict';

const truckModel = require('./model/truck');
const parcelModel = require('./model/parcel');

const createTruck = async (truckData) => {
  return await new truckModel(truckData)
    .save()
    .catch((err) => console.error(err.message));
};

const findTruck = async (id) => {
  const query = { id };
  return await truckModel
    .findOne(query)
    .catch((err) => console.error(err.message));
};

const findAllTruck = async () => {
  return await truckModel.find()
    .catch((err) => console.error(err.message));
};

const updateTruck = async (id, updateData) => {
  const query = { id };
  return await truckModel
    .findOneAndUpdate(query, updateData,
      {new: true, runValidators: true})
    .catch((err) => console.error(err.message));
};

const findAndRemoveTruck = async (id) => {
  const query = { id };
  return await truckModel
    .findOneAndDelete(query)
    .catch((err) => console.error(err.message));
};

const createParcel = async (truckData) => {
  return await new parcelModel(truckData)
    .save()
    .catch((err) => console.error(err.message));
};


const findParcel = async (id) => {
  const query = { id };
  return await parcelModel
    .findOne(query)
    .catch((err) => console.error(err.message));
};

const updateParcel = async (id, updateData) => {
  const query = { id };
  return await parcelModel
    .findOne(query, updateData)
    .catch((err) => console.error(err.message));
};

const findAndRemoveParcel = async (id) => {
  const query = { id };
  return await parcelModel
    .findOneAndDelete(query)
    .catch((err) => console.error(err.message));
};

module.exports = {
  findTruck,
  createTruck,
  updateTruck,
  findAndRemoveTruck,
  findParcel,
  createParcel,
  updateParcel,
  findAndRemoveParcel,
  findAllTruck
};
