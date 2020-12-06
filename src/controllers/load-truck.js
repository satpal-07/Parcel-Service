const Joi = require('joi');
const { generateParcels, sumParcelWeight, formatWeight } = require('./utils');
const { updateTruckById, findTruckById, insertManyParcels } = require('../db-handler/db-query');

/**
 * Endpoint name
 */
const endpointName = '/loadTruck';

/**
 * Endpoint validation schema
 */
const endpointSchema = Joi.object({
  truckId: Joi.string().guid().required(),
  parcelCount: Joi.number(),
  parcelWeight: Joi.number(),
});

/**
 * Endpoint to load the truck - loads the truck with given parcel list or by creating given or default number of parcels with given or default weight
 *
 * @param {Object} request - route request object
 * @param {Object} response - route response object
 */
const endpoint = async (request, response) => {
  try {
    // get body params
    const id = request.body.truckId;
    const parcelCount = request.body.parcelCount;
    const parcelWeight = request.body.parcelWeight;

    // get the truck
    const truck = await findTruckById(id).catch((err) => {
      console.error('Error in getting truck from the DB');
      throw new Error(err.message);
    });

    // return 404 if no truck is found
    if (!truck)
      return response.status(404).send('No truck found associated with the truck id');

    // generate parcels - if parcel count is undefined then default value will be used. if parcel weight is undefined then random weight will be used for each parcel
    const parcels = generateParcels({
      count: parcelCount,
      weight: parcelWeight,
      truckId: id,
    });

    // save the parcels
    await insertManyParcels(parcels).catch((err) => {
      console.error('Error in saving parcels in DB');
      throw new Error(err.message);
    });

    // add the parcel and calculated weight
    const update = {
      parcelCount: parcels.length + truck.parcelCount,
      // sum the parcel weight to get the total weight of the truck
      weight: formatWeight({quantity: sumParcelWeight(parcels), currentWeight: truck.weight}),
    };

    // update the truck
    const updatedTruck = await updateTruckById(id, update).catch((err) => {
      console.error('Error in updating truck in the DB');
      throw new Error(err.message);
    });

    // return the updated truck details
    response.status(200).json(updatedTruck);
  } catch (error) {
    console.error('Error in loading the truck: ' + error.message);
    response.status(500).send('Unable to load the truck due to server error!');
  }
};

module.exports = {
  endpoint,
  endpointName,
  endpointSchema,
};
