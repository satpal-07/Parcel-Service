jest.mock('../../db-handler/db-query');
const { v4: uuidv4 } = require('uuid');
const app = require('../../app');
const request = require('supertest')(app);
const dbQuery = require('../../db-handler/db-query');

describe('Create truck controller tests', () => {
  afterEach(() => {
    // to reset the DB query after each test
    dbQuery.createTruck.mockClear();
  });

  it('should return 400 when uuid is invalid', async () => {
    const response = await request
      .post('/createTruck')
      .send({ truckId: 'random' });
    expect(response.statusCode).toBe(400);
  });

  it('should return 200 and newly created truck detail', async () => {
    const uuid = uuidv4();
    const newTruck = {
      id: uuid,
      parcels: [],
      weight: { quantity: 0, unit: 'kg' },
    };
    dbQuery.createTruck.mockReturnValue(Promise.resolve(true));
    const response = await request
      .post('/createTruck')
      .send({ truckId: uuid, parcelList: [] });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(newTruck);
  });

  it('should return 500 when Db throws error', async () => {
    dbQuery.createTruck.mockReturnValue(new Error('Error in DB'));
    const response = await request.post('/createTruck');
    expect(response.statusCode).toBe(500);
  });
});
