const { updateTruck, findTruck } = require('../db-handler/db-query');
const Joi = require('joi');
const { getTruckWeight, formatWeight } = require('./utils');
const endpointName = '/unloadTruck';

const endpointSchema = Joi.object({
  truckId: Joi.string().guid().required(),
});

const endpoint = async (request, response) => {
  try {
    const query = request.body.truckId;
    const truck = await findTruck(query).catch((err) => {
      console.error('Error in getting truck list: ' + err.message);
      response.status(503).send('Service Unavailable');
    });
    const responseMessage = {
      message: 'unloaded following parcels',
      parcels: truck.parcels,
    };
    const parcels = [];
    const update = {
      parcels,
      weight: formatWeight(getTruckWeight(parcels)),
    };
    await updateTruck(query, update).catch((err) => {
      console.error('Error in updating truck: ' + err.message);
      throw new Error('error: ' + err.message);
    });
    response.status(200).json(responseMessage);
  } catch (error) {
    console.error('Error in unloading truck: ' + error.message);
    response.status(500).send('Unable to unload truck due to server error!');
  }
};

module.exports = {
  endpoint,
  endpointName,
  endpointSchema,
};
