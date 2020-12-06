const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const { sumParcelWeight, generateParcels, formatWeight } = require('./utils');
const { createTruck } = require('../db-handler/db-query');
const dbQuery = require('../db-handler/db-query');

/**
 * Endpoint name
 */
const endpointName = '/createTruck';

/**
 * Endpoint validation schema
 */
const endpointSchema = Joi.object({
  truckId: Joi.string().guid(),
  parcelList: Joi.array(),
  parcelCount: Joi.number(),
  parcelWeight: Joi.number(),
});

/**
 * Endpoint to create truck - creates the truck
 *
 * @param {Object} request - route request object
 * @param {Object} response - route response object
 */
const endpoint = async (request, response) => {
  try {
    // get or create the required params for the generating the truck
    const id = request.body.truckId || uuidv4();
    const parcelCount = request.body.parcelCount;
    const parcelWeight = request.body.parcelWeight;

    // generate parcels - if parcel count is undefined then default value will be used. if parcel weight is undefined then random weight will be used for each parcel
    const parcels =
      request.body.parcelList ||
      generateParcels({
        count: parcelCount,
        weight: parcelWeight,
        truckId: id,
      });

    // truck data
    const truckData = {
      id: id,
      weight: formatWeight({ quantity: sumParcelWeight(parcels) }),
      parcelCount: parcels.length,
    };

    if (parcels && parcels.length > 0) {
      // save the parcels
      await dbQuery.insertManyParcels(parcels).catch((err) => {
        console.error('Error in saving parcels in DB');
        throw new Error(err.message);
      });
    }

    // save the truck
    await createTruck(truckData).catch((err) => {
      console.error('Error in saving newly created truck in DB');
      throw new Error(err.message);
    });

    // return the newly created truck detail
    response.status(200).json(truckData);
  } catch (error) {
    console.error('Error in new creating truck: ' + error.message);
    response
      .status(500)
      .send('Unable to create new truck due to server error!');
  }
};

module.exports = {
  endpoint,
  endpointName,
  endpointSchema,
};
