jest.mock('../../db-handler/db-query');
const app = require('../../app');
const request = require('supertest')(app);
const dbQuery = require('../../db-handler/db-query');
const { truckWithParcels } = require('../mock-objects/truck-data.json');

describe('Load truck controller tests', () => {
  afterEach(() => {
    // to reset the DB query after each test
    dbQuery.updateTruckById.mockClear();
  });

  it('should return 400 when truck id is missing', async () => {
    const response = await request.post('/loadTruck');
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 when truck id is invalid', async () => {
    const response = await request
      .post('/loadTruck')
      .send({ truckId: 'random' });
    expect(response.statusCode).toBe(400);
  });

  it('should return 200 and truck details when truck is loaded', async () => {
    dbQuery.updateTruckById.mockReturnValue(Promise.resolve(truckWithParcels));
    const response = await request
      .post('/loadTruck')
      .send({ truckId: '5c37395b-fe9b-40a8-b879-b3f6814a30f4' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(truckWithParcels);
  });

  it('should return 404 when truck is not found', async () => {
    dbQuery.updateTruckById.mockReturnValue(Promise.resolve(null));
    const response = await request
      .post('/loadTruck')
      .send({ truckId: '5c37395b-fe9b-40a8-b879-b3f6814a30f4' });
    expect(response.statusCode).toBe(404);
  });

  it('should return 500 when Db throws error', async () => {
    dbQuery.updateTruckById.mockReturnValue(new Error('Error in DB'));
    const response = await request.post(
      '/loadTruck').send({ truckId: '5c37395b-fe9b-40a8-b879-b3f6814a30f4' })
    expect(response.statusCode).toBe(500);
  });
});
