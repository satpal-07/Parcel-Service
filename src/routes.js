const express = require('express');
const router = express.Router();
const validator = require('express-joi-validation').createValidator({})
const getTruck = require('./controllers/get-truck.js');
const getTruckWeight = require('./controllers/get-truck-weight');
const getParcelCount = require('./controllers/get-parcels-count');
const getAllTruck = require('./controllers/get-truck-list');
const createTruck = require('./controllers/create-truck');
const loadTruck = require('./controllers/load-truck');
const unloadTruck = require('./controllers/unload-truck');

/**
 * @description get the truck associated with the the given truck id
 * @queryParam {truckId} - truck id
 */
router.get(
  getTruck.endpointName,
  validator.query(getTruck.endpointSchema),
  getTruck.endpoint
);

/**
 * @description get all the trucks
 */
router.get(
  getAllTruck.endpointName,
  getAllTruck.endpoint
);

/**
 * @description get the truck weight of the given truck id
 * @queryParam {truckId} - truck id
 */
router.get(
  getTruckWeight.endpointName,
  validator.query(getTruckWeight.endpointSchema),
  getTruckWeight.endpoint
);

/**
 * @description get the parcel count in the given truck id
 * @queryParam {truckId} - truck id
 */
router.get(
  getParcelCount.endpointName,
  validator.query(getParcelCount.endpointSchema),
  getParcelCount.endpoint
);

/**
 * @description Creates truck with parcels if given
 * @body {truckId} - (optional) truck id
 * @body {parcelList} - (optional) truck will be preloaded with given parcel list
 * @body {parcelCount} - (optional) truck will be preloaded with given parcel count
 * @body {parcelWeight} - (optional) weight of each parcel
 */
router.post(
  createTruck.endpointName,
  validator.body(createTruck.endpointSchema),
  createTruck.endpoint
);

/**
 * @description Loads the truck associated with the given truck id
 * @body {truckId} - truck id
 * @body {parcelCount} - (optional) truck will be loaded with given parcel count - default is 10
 * @body {parcelWeight} - (optional) weight of each parcel - default is randomised for each parcel
 */
router.post(
  loadTruck.endpointName,
  validator.body(loadTruck.endpointSchema),
  loadTruck.endpoint
);

/**
 * @description Unloads all the parcels of the truck associated with the given truck id
 * @body {truckId} - truck id
 */
router.post(
  unloadTruck.endpointName,
  validator.body(unloadTruck.endpointSchema),
  unloadTruck.endpoint
);

/**
 * Not Found endpoint exception handling.
 */
router.all('*', function (req, res) {
  res.status(404).json({
    error: 'Not Found',
  });
});

module.exports = router;