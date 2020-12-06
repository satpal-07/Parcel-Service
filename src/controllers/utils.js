const { v4: uuidv4 } = require('uuid');

/**
 * Creates weight object with given weight and unit
 *
 * @param {number} [weight=0] - weight quantity
 * @param {string} [unit='kg'] - weight unit
 * @returns {Object} - weight object with quantity and unit fields
 */
const createWeight = (weight = 0, unit = 'kg') => {
  return { unit, quantity: weight || Math.ceil(Math.random() * 10) };
};

/**
 * Calculates the truck weight
 *
 * @param {Object} truck
 * @returns {Number} - weight of the truck
 */
const sumParcelWeight = (parcels) => {
  if (!parcels || !parcels.length) return 0;
  let truckWeight = 0;
  parcels.forEach((element) => {
    truckWeight += element.weight.quantity;
  });
  return truckWeight;
};

/**
 * Generates parcels with given count and weight
 *
 * @param {Object} {count = 10, weight = 0} - number of parcels and its weight. if weight is 0 then random number is used for each parcel weight
 * @returns {Array} - list of generated parcels
 */
const generateParcels = ({ count = 10, weight = 0 }) => {
  const parcels = [];
  for (let i = 0; i < count; i++) {
    parcels.push({
      id: uuidv4(),
      weight: createWeight(weight),
    });
  }
  return parcels;
};

/**
 * Formats the weight into weight object
 *
 * @param {Number} quantity - weight quantity
 * @param {string} [unit='kg'] - weight unit
 * @returns {Object} - weight object
 */
const formatWeight = (quantity, unit = 'kg') => {
  return { quantity, unit };
};

module.exports = {
  createWeight,
  sumParcelWeight,
  generateParcels,
  formatWeight,
};
