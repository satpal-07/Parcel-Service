const app = require('../app');
const request = require('supertest')(app);

describe('Unhandled route and method test', () => {
  it('should return 404 if route is unhandled', async () => {
    const response = await request.get('/test');
    expect(response.statusCode).toBe(404);
  });

  it('should return 404 if route is unhandled', async () => {
    const response = await request.delete('/test');
    expect(response.statusCode).toBe(405);
  });
});
