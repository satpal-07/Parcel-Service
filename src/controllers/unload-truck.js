const Joi = require('joi');
const { sumParcelWeight, formatWeight } = require('./utils');
const { updateTruckById, findTruckById, findParcelsByTruckId, findAndRemoveParcelsByTruckId } = require('../db-handler/db-query');

/**
 * Endpoint name
 */
const endpointName = '/unloadTruck';

/**
 * Endpoint validation schema
 */
const endpointSchema = Joi.object({
  truckId: Joi.string().guid().required(),
});

/**
 * Endpoint to unload the truck - unloads all the parcel from a truck associated with the given truck id
 *
 * @param {Object} request - route request object
 * @param {Object} response - route response object
 */
const endpoint = async (request, response) => {
  try {
    // get body params
    const truckId = request.body.truckId;

    // get the truck
    const truck = await findTruckById(truckId).catch((err) => {
      console.error('Error in getting truck from the DB');
      throw new Error(err.message);
    });

    // return 404 if no truck is found
    if (!truck)
      return response.status(404).send('No truck found associated with the truck id');

    const parcels = await findParcelsByTruckId(truckId).catch((err) => {
      console.error('Error in getting parcels from the DB');
      throw new Error(err.message);
    });

    // return 404 if no parcels is found
    if (!parcels || parcels.length === 0)
      return response.status(404).send('No parcels found associated with the truck id');


    // extract the parcels so it can be returned to calling service
    const responseMessage = {
      message: 'unloaded following parcels',
      parcels: parcels,
      parcelCount: parcels.length
    };

    // update query
    const update = {
      parcelCount: truck.parcelCount - parcels.length,
      // calculate the new truck weight
      weight: formatWeight({quantity: sumParcelWeight([])}),
    };

    await findAndRemoveParcelsByTruckId(truckId).catch((err) => {
      console.error('Error deleting parcels from the DB');
      throw new Error(err.message);
    });

    // update the truck
    await updateTruckById(truckId, update).catch((err) => {
      console.error('Error in updating truck');
      throw new Error(err.message);
    });

    // return the unloaded parcels
    response.status(200).json(responseMessage);
  } catch (error) {
    console.error('Error in unloading truck: ' + error.message);
    response
      .status(500)
      .send('Unable to unload the truck due to server error!');
  }
};

module.exports = {
  endpoint,
  endpointName,
  endpointSchema,
};
