const { findAllTrucks } = require('../db-handler/db-query');

/**
 * Endpoint name
 */
const endpointName = '/getAllTruck';


/**
 * Endpoint to get the all the trucks
 *
 * @param {Object} request - route request object
 * @param {Object} response - route response object
 */
const endpoint = async (request, response) => {
  try {
    // get all the truck
    const truck = await findAllTrucks().catch((err) => {
      console.error('Error in getting truck list from the DB');
      throw new Error(err.message);
    });

    // return the all the trucks
    response.status(200).json(truck);
  } catch (error) {
    console.error('Error in getting truck list: ' + error.message);
    response.status(500).send('Unable to get all the trucks due to server error!');
  }
};

module.exports = {
  endpoint,
  endpointName,
};
