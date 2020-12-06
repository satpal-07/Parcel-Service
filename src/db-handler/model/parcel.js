const mongoose = require('mongoose');
const mongoConfig = require('config').app.mongoConfig;
const LoadingServiceDb = mongoose.connection.useDb(mongoConfig.dbName);


// parcel schema
const parcelSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  weight: {
    type: Object,
    required: true,
  },
  truckId: {
    type: String,
    required: false,
  },
});

/**
 * Sanitise truck data function
 */
parcelSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.__v;
  delete obj._id;
  return obj;
};

module.exports = LoadingServiceDb.model('parcels', parcelSchema);
