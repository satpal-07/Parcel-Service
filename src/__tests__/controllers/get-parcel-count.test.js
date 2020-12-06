jest.mock('../../db-handler/db-query');
const app = require('../../app');
const request = require('supertest')(app);
const dbQuery = require('../../db-handler/db-query');
const { truck } = require('../mock-objects/truck-data.json');

describe('Get truck parcel count controller tests', () => {
  afterEach(() => {
    // to reset the DB query after each test
    dbQuery.findTruckById.mockClear();
  });

  it('should return 400 when truck id is missing', async () => {
    const response = await request.get('/getParcelCount');
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 when truck id is invalid', async () => {
    const response = await request.get('/getParcelCount?truckId=random');
    expect(response.statusCode).toBe(400);
  });

  it('should return 200 and truck weight', async () => {
    dbQuery.findTruckById.mockReturnValue(Promise.resolve(truck));
    const response = await request.get(
      '/getParcelCount?truckId=5c37395b-fe9b-40a8-b879-b3f6814a30f4'
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ parcelCount: truck.parcelCount });
  });

  it('should return 500 when Db throws error', async () => {
    dbQuery.findTruckById.mockReturnValue(new Error('Error in DB'));
    const response = await request.get(
      '/getParcelCount?truckId=5c37395b-fe9b-40a8-b879-b3f6814a30f4'
    );
    expect(response.statusCode).toBe(500);
  });
});
