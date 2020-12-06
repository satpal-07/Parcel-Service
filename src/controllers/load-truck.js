const Joi = require('joi');
const { generateParcels, sumParcelWeight, formatWeight } = require('./utils');
const { updateTruckById } = require('../db-handler/db-query');

/**
 * Endpoint name
 */
const endpointName = '/loadTruck';

/**
 * Endpoint validation schema
 */
const endpointSchema = Joi.object({
  truckId: Joi.string().guid().required(),
  parcelCount: Joi.number(),
  parcelWeight: Joi.number(),
});

/**
 * Endpoint to load the truck - loads the truck with given parcel list or by creating given or default number of parcels with given or default weight
 *
 * @param {Object} request - route request object
 * @param {Object} response - route response object
 */
const endpoint = async (request, response) => {
  try {

    // get body params
    const query = request.body.truckId;
    const parcelCount = request.body.parcelCount;
    const parcelWeight = request.body.parcelWeight;

    // generate parcels - if parcel count is undefined then default value will be used. if parcel weight is undefined then random weight will be used for each parcel
    const parcels = generateParcels({
      count: parcelCount,
      weight: parcelWeight,
    });

    // add the parcel and calculated weight
    const update = {
      parcels,
      // sum the parcel weight to get the total weight of the truck
      weight: formatWeight(sumParcelWeight(parcels)),
    };

    // update the truck
    const truck = await updateTruckById(query, update).catch((err) => {
      console.error('Error in updating truck in the DB');
      throw new Error(err.message);
    });

    // return the updated truck details
    response.status(200).json(truck);
  } catch (error) {
    console.error('Error in loading the truck: ' + error.message);
    response.status(500).send('Unable to load the truck due to server error!');
  }
};

module.exports = {
  endpoint,
  endpointName,
  endpointSchema,
};
