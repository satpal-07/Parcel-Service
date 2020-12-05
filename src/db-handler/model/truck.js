//'use strict';
const mongoose = require('mongoose');
const mongoConfig = require('config').app.mongoConfig;
const LoadingServiceDb = mongoose.connection.useDb(mongoConfig.dbName);

// truck schema
const truckSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  weight: {
    type: Object,
    required: true
  },
  parcels: {
    type: Array,
    required: true
  },
});


truckSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.__v;
  delete obj._id;
  return obj;
};

module.exports = LoadingServiceDb.model('trucks', truckSchema);