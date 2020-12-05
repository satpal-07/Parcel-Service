const { updateTruck } = require('../db-handler/db-query');
const Joi = require('joi');
const { generateParcels, getTruckWeight, formatWeight } = require('./utils');
const endpointName = '/loadTruck';

const endpointSchema = Joi.object({
  truckId: Joi.string().guid().required(),
  parcelCount: Joi.number(),
  parcelWeight: Joi.number(),
});

const endpoint = async (request, response) => {
  try {
    const query = request.body.truckId;
    const parcelCount = request.body.parcelCount;
    const parcelWeight = request.body.parcelWeight;
    const parcels = generateParcels({ count: parcelCount, weight: parcelWeight });
    const update = {
      parcels,
      weight: formatWeight(getTruckWeight(parcels))
    };
    const truck = await updateTruck(query, update).catch((err) => {
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
  endpointSchema,
};
