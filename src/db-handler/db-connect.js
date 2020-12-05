//'use strict';
const mongoose = require('mongoose');
const app = require('../app');
const mongoConfig = require('config').app.mongoConfig;

const setUp = async () => {
  const options = { useNewUrlParser: true, useUnifiedTopology: true };
  let dbURI = `mongodb://${mongoConfig.host}:${mongoConfig.port}`;

  mongoose.connect(dbURI, options, function (err) {
    if (err) {
      console.error(
        `There was an error connecting to the database: ${err.message}`
      );
    } else {
      console.log('Successfully connected to the database');
    }
  });

  mongoose.connection.on('connecting', () => {
    console.log('Connecting to MongoDB...');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
    mongoose.disconnect();
  });

  mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB!', dbURI);
  });

  mongoose.connection.once('open', () => {
    console.log('MongoDB connection opened!');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected!');
  });

  mongoose.connection.on('disconnected', () => {
    console.error(`MongoDB disconnected!`);
    setTimeout(() => connect(), mongoConfig.timeout);
  });

  mongoose.set('useCreateIndex', true)

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', async () => {
    mongoose.connection.close(() => {
      console.log(
        'Mongoose default connection disconnected through app termination'
      );
      process.exit(0);
    });
  });
};

module.exports = {
  setUp,
};
