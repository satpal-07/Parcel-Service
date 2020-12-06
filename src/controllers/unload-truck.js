const Joi = require('joi');
const { sumParcelWeight, formatWeight } = require('./utils');
const { updateTruckById, findTruckById } = require('../db-handler/db-query');

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
    const query = request.body.truckId;

    // get the truck
    const truck = await findTruckById(query).catch((err) => {
      console.error('Error in getting truck from the DB');
      throw new Error(err.message);
    });

    // return 404 if no truck is found
    if (!truck)
      return response.status(404).send('No truck found associated with the truck id');

    // extract the parcels so it can be returned to calling service
    const responseMessage = {
      message: 'unloaded following parcels',
      parcels: truck.parcels,
    };

    // create empty parcel list
    const parcels = [];

    // update query
    const update = {
      parcels,
      // calculate the new truck weight
      weight: formatWeight(sumParcelWeight(parcels)),
    };

    // update the truck
    await updateTruckById(query, update).catch((err) => {
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
