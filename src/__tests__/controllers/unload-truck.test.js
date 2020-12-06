jest.mock('../../db-handler/db-query');
const app = require('../../app');
const request = require('supertest')(app);
const dbQuery = require('../../db-handler/db-query');
const { truckWithParcels, emptyTruck } = require('../mock-objects/truck-data.json');
const { parcelList } = require('../mock-objects/parcel-data.json');

describe('Unload truck controller tests', () => {
  afterEach(() => {
    // to reset the DB query after each test
    dbQuery.updateTruckById.mockClear();
    dbQuery.findTruckById.mockClear();
    dbQuery.findParcelsByTruckId.mockClear();
    dbQuery.findAndRemoveParcelsByTruckId.mockClear();
  });

  it('should return 400 when truck id is missing', async () => {
    const response = await request.post('/unloadTruck');
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 when truck id is invalid', async () => {
    const response = await request
      .post('/unloadTruck')
      .send({ truckId: 'random' });
    expect(response.statusCode).toBe(400);
  });

  it('should return 200 and unloaded parcels details when truck is unloaded', async () => {
    dbQuery.findParcelsByTruckId.mockReturnValue(Promise.resolve(parcelList));
    dbQuery.findTruckById.mockReturnValue(Promise.resolve(truckWithParcels));
    dbQuery.updateTruckById.mockReturnValue(Promise.resolve(emptyTruck));
    dbQuery.findAndRemoveParcelsByTruckId.mockReturnValue(
      Promise.resolve(true)
    );
    const response = await request
      .post('/unloadTruck')
      .send({ truckId: '5c37395b-fe9b-40a8-b879-b3f6814a30f4' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'unloaded following parcels',
      parcelCount: parcelList.length,
      parcels: parcelList,
    });
  });

  it('should return 404 when truck is not found', async () => {
    dbQuery.findTruckById.mockReturnValue(Promise.resolve(null));
    const response = await request
      .post('/unloadTruck')
      .send({ truckId: '5c37395b-fe9b-40a8-b879-b3f6814a30f4' });
    expect(response.statusCode).toBe(404);
  });

  it('should return 500 when Db throws error', async () => {
    dbQuery.findTruckById.mockReturnValue(new Error('Error in DB'));
    const response = await request
      .post('/unloadTruck')
      .send({ truckId: '5c37395b-fe9b-40a8-b879-b3f6814a30f4' });
    expect(response.statusCode).toBe(500);
  });
});
