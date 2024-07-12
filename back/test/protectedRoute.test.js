const request = require('supertest');
const app = require('../server'); // Adjust this path to where your Express app is initialized

describe('GET /protected', () => {
  it('should require authorization', async () => {
    const response = await request(app).get('/protected');
    expect(response.statusCode).toBe(401); // Expect unauthorized if no token is provided
  });

  it('should respond with protected data if authorized', async () => {
    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer YOUR_VALID_JWT_TOKEN`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'You have accessed a protected route!');
    // Add more assertions as needed based on your expected response
  });
});