const Joi = require('joi');
const { findTruckById } = require('../db-handler/db-query');

/**
 * Endpoint name
 */
const endpointName = '/getParcelCount';

/**
 * Endpoint validation schema
 */
const endpointSchema = Joi.object({
  truckId: Joi.string().guid().required(),
});


/**
 * Endpoint to get the parcel count of a truck - gets the parcel count of the truck associated with the given id
 *
 * @param {Object} request - route request object
 * @param {Object} response - route response object
 */
const endpoint = async (request, response) => {
  try {
    // get query param
    const truckId = request.query.truckId;

    // get the truck
    const truck = await findTruckById(truckId).catch((err) => {
      console.error('Error in getting truck from the DB');
      throw new Error(err.message);
    });

    // Use the parcel length as parcel count
    const responseMessage = { parcelCount: truck.parcels.length};

    // return the parcel count
    response.status(200).json(responseMessage);
  } catch (error) {
    console.error('Error in getting parcel count: ' + error.message);
    response.status(500).send('Unable to get the parcel count due to server error!');
  }
};

module.exports = {
  endpoint,
  endpointName,
  endpointSchema,
};
