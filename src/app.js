//'use strict';
const express = require('express');
// const { getTruck, getTruckEndpoint } = require('./controllers/get-truck.js');
// const {
//   createTruck,
//   createTruckEndpoint,
// } = require('./controllers/create-truck.js');
// const { loadTruck, loadTruckEndpoint } = require('./controllers/load-truck');
// const {
//   unloadTruck,
//   unloadTruckEndpoint,
// } = require('./controllers/unload-truck');
// const {
//   parcelNumber,
//   parcelNumberEndpoint,
// } = require('./controllers/get-parcels-number');
const router = require('./routes');
const allowedMethods = ['GET', 'POST', 'DELETE'];
const app = express();
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
app.use(compression());
app.use(helmet());
app.use(express.json());



// middleware to block unused methods
app.use((req, res, next) => {
  if (!allowedMethods.includes(req.method)) {
    res.status(405).send({ message: 'Method is not supported' });
  } else {
    next();
  }
});

app.use(
  morgan('combined', {
    format: 'default',
    stream: {
      write: function (str) {
        console.debug(str);
      }
    },
    skip: function (req, res) {
      return false;
    }
  })
);

// Assign the routes
app.use(router);

// This error handler will be used for throwing validation errors
app.use((err, req, res, next) => {
  console.error(`Error validating request parameters: ${err.message}`);
  res.status(400).json(err);
});

module.exports = app;
