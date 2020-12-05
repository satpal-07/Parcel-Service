const { findTruck } = require('../db-handler/db-query');
const Joi = require('joi');
const { getTruckWeight } = require('./utils');
const endpointName = '/getTruckWeight';

const endpointSchema = Joi.object({
  truckId: Joi.string().guid().required(),
});

const endpoint = async (request, response) => {
  try {
    const query = request.query.truckId;
    const truck = await findTruck(query).catch((err) => {
      console.error('Error in getting truck list: ' + err.message);
      response.status(503).send('Service Unavailable');
    });
    const responseMessage = { weight: truck.weight};
    response.status(200).json(responseMessage);
  } catch (error) {
    console.error('Error in getting truck list: ' + error.message);
    response.status(500).send('Server error!');
  }
};

module.exports = {
  endpoint,
  endpointName,
  endpointSchema,
};
