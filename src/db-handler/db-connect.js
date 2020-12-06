const mongoose = require('mongoose');
const mongoConfig = require('config').app.mongoConfig;

/**
 * Sets up the DB - connects the server to DB and other essential DB set up operations
 */
const setUp = async () => {
  // add the required mongo options
  const options = { useNewUrlParser: true, useUnifiedTopology: true };
  // create the mongo db uri
  let dbURI = `mongodb://${mongoConfig.host}:${mongoConfig.port}`;

  // connect to mongo DB
  mongoose.connect(dbURI, options, function (err) {
    if (err) {
      console.error(
        `There was an error connecting to the database: ${err.message}`
      );
    } else {
      console.log('Successfully connected to the database');
    }
  });

  // on connecting event call back
  mongoose.connection.on('connecting', () => {
    console.log('Connecting to MongoDB...');
  });

  // on error event call back
  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
    mongoose.disconnect();
  });

  // on connected event call back
  mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB!', dbURI);
  });

  // on open event call back
  mongoose.connection.once('open', () => {
    console.log('MongoDB connection opened!');
  });

  // on reconnected event call back
  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected!');
  });

  // on disconnect event call back
  mongoose.connection.on('disconnected', () => {
    console.error(`MongoDB disconnected!`);
    setTimeout(() => setUp(), mongoConfig.timeout);
  });

  // create our own index
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
