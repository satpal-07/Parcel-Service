const mongoose = require('mongoose');
const mongoConfig = require('config').app.mongoConfig;
const ParcelServiceDb = mongoose.connection.useDb(mongoConfig.dbName);

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
  parcelCount: {
    type: Number,
    required: true
  },
});

/**
 * Sanitise truck data function
 */
truckSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.__v;
  delete obj._id;
  return obj;
};

module.exports = ParcelServiceDb.model('trucks', truckSchema);
