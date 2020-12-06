jest.mock('../../db-handler/db-query');
const app = require('../../app');
const request = require('supertest')(app);
const dbQuery = require('../../db-handler/db-query');
const { truckList } = require('../mock-objects/truck-data.json');

describe('Get truck list controller tests', () => {
  afterEach(() => {
    // to reset the DB query after each test
    dbQuery.findAllTrucks.mockClear();
  });

  it('should return 200 when truck list is found', async () => {
    dbQuery.findAllTrucks.mockReturnValue(Promise.resolve(truckList));
    const response = await request.get('/getAllTruck');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(truckList);
  });

  it('should return 500 when DB throws error', async () => {
    dbQuery.findAllTrucks.mockReturnValue(new Error('Error in DB'));
    const response = await request.get('/getAllTruck');
    expect(response.statusCode).toBe(500);
  });
});
