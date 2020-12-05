const { findAllTruck } = require('../db-handler/db-query');
const endpointName = '/getAllTruck';

const endpoint = async (request, response) => {
  try {
    const truck = await findAllTruck().catch((err) => {
      console.error('Error in getting truck list: ' + err.message);
      response.status(503).send('Service Unavailable');
    });
    response.status(200).json(truck);
  } catch (error) {
    console.error('Error in getting truck list: ' + error.message);
    response.status(500).send('Server error!');
  }
};

module.exports = {
  endpoint,
  endpointName,
};
