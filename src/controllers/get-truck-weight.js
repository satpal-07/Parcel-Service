const Joi = require('joi');
const { findTruckById } = require('../db-handler/db-query');

/**
 * Endpoint name
 */
const endpointName = '/getTruckWeight';

/**
 * Endpoint validation schema
 */
const endpointSchema = Joi.object({
  truckId: Joi.string().guid().required(),
});

/**
 * Endpoint to get the truck weight - gets the weight of the truck associated with the given id
 *
 * @param {Object} request - route request object
 * @param {Object} response - route response object
 */
const endpoint = async (request, response) => {
  try {
    // get query param
    const query = request.query.truckId;

    // get the truck
    const truck = await findTruckById(query).catch((err) => {
      console.error('Error in getting truck from the DB');
      throw new Error(err.message);
    });

    // return 404 if no truck is found
    if (!truck)
      return response.status(404).send('No truck found associated with the truck id');

    // truck weight
    const responseMessage = { weight: truck.weight};

    // return the truck weight
    response.status(200).json(responseMessage);
  } catch (error) {
    console.error('Error in getting the truck weight: ' + error.message);
    response.status(500).send('Unable to get the truck weight due to server error!');
  }
};

module.exports = {
  endpoint,
  endpointName,
  endpointSchema,
};
