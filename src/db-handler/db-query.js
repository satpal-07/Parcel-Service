const truckModel = require('./model/truck');
const parcelModel = require('./model/parcel');

/**
 * Creates the truck
 *
 * @param {Object} truckData - truck data
 * @returns {Object} newly created truck object
 */
const createTruck = async (truckData) => {
  return await new truckModel(truckData)
    .save()
    .catch((err) => console.error(err.message));
};

/**
 * Finds one truck associated with given id
 *
 * @param {uuid} id - truck id
 * @returns {Object} truck object
 */
const findTruckById = async (id) => {
  const query = { id };
  return await truckModel
    .findOne(query)
    .catch((err) => console.error(err.message));
};

/**
 * Finds all the trucks
 *
 * @returns {Array} truck list
 */
const findAllTrucks = async () => {
  return await truckModel.find().catch((err) => console.error(err.message));
};

/**
 * Updates the truck associated with the given id
 *
 * @param {uuid} id
 * @param {Object} updateData
 * @returns
 */
const updateTruckById = async (id, updateData) => {
  const query = { id };
  return await truckModel
    .findOneAndUpdate(query, updateData, { new: true, runValidators: true })
    .catch((err) => console.error(err.message));
};

/**
 * Removes truck by id
 *
 * @param {uuid} truckId - truck id
 * @returns {Object} - removed parcel
 */
const findAndRemoveTruckById = async (id) => {
  const query = { id };
  return await truckModel
    .findOneAndDelete(query)
    .catch((err) => console.error(err.message));
};

/**
 * Creates Parcel
 *
 * @param {*} parcelData - parcel data
 * @returns {Object} newly created parcel object
 */
const createParcel = async (parcelData) => {
  return new parcelModel(parcelData);
};

/**
 * Saves parcel list
 *
 * @param {*} parcelList - parcel list
 * @returns {Object} newly created parcel list
 */
const insertManyParcels = async (parcelList) => {
  return await parcelModel
    .insertMany(parcelList)
    .catch((err) => console.error(err.message));
};

/**
 * Finds parcel(s) associated with the truck id
 *
 * @param {uuid} truckId - truck id
 * @returns {Array} - Parcel list
 */
const findParcelsByTruckId = async (truckId) => {
  const query = { truckId };
  return await parcelModel
    .find(query)
    .catch((err) => console.error(err.message));
};

/**
 * Updates parcel by id
 *
 * @param {uuid} id
 * @param {Object} updateData
 * @returns {Object} - updated parcel
 */
const updateParcelById = async (id, updateData) => {
  const query = { id };
  return await parcelModel
    .findOne(query, updateData)
    .catch((err) => console.error(err.message));
};

/**
 * Removes parcel by truck id
 *
 * @param {uuid} id - truck id
 * @returns {Object} - removed parcel
 */
const findAndRemoveParcelById = async (id) => {
  const query = { id };
  return await parcelModel
    .findOneAndDelete(query)
    .catch((err) => console.error(err.message));
};

/**
 * Removes parcel by truck id
 *
 * @param {uuid} truckId - truck id
 * @returns {Object} - removed parcel
 */
const findAndRemoveParcelsByTruckId = async (truckId) => {
  const query = { truckId };
  return await parcelModel
    .deleteMany(query)
    .catch((err) => console.error(err.message));
};

module.exports = {
  findTruckById,
  createTruck,
  updateTruckById,
  findAndRemoveTruckById,
  findParcelsByTruckId,
  createParcel,
  updateParcelById,
  findAndRemoveParcelById,
  findAllTrucks,
  findAndRemoveParcelsByTruckId,
  insertManyParcels,
};
