const { createTruck } = require('../db-handler/db-query');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const { getTruckWeight, generateParcels, formatWeight } = require('./utils');
const endpointName = '/createTruck';

const endpointSchema = Joi.object({
  truckId: Joi.string().guid(),
  parcelList: Joi.array(),
  parcelCount: Joi.number(),
  parcelWeight: Joi.number(),
});

const endpoint = async (request, response) => {
  try {
    const id = request.body.id || uuidv4();
    const parcelCount = request.body.parcelCount;
    const parcelWeight = request.body.parcelWeight;
    const parcels =
      request.body.parcelList ||
      generateParcels({ count: parcelCount, weight: parcelWeight });
    const truckData = {
      id: id,
      parcels: parcels,
      weight: formatWeight(getTruckWeight(parcels)),
    };
    await createTruck(truckData).catch((err) => {
      console.error('Error in getting truck list: ' + err.message);
      response.status(503).send('Service Unavailable');
    });
    response.status(200).json(truckData);
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
