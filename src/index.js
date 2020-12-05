'use strict'
const appConfig = require('config').app;
const dbConnection = require('./db-handler/db-connect.js');
const app = require('./app');
// connect to db
dbConnection.setUp();

// create server
app.listen(appConfig.port, function () {
  console.log(
    `The ${appConfig.serviceName} service is now running on port ${appConfig.port}`
  );
});