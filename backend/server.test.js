const request = require('supertest');
const { app } = require('./server');

describe('Backend API', () => {
  beforeAll(() => {
    app.locals.db = {
      query: jest.fn((sql) => {
        if (sql.includes('SELECT 1')) {
          return Promise.resolve({ rows: [{ '?column?': 1 }] });
        }
        if (sql.includes('FROM transactions')) {
          return Promise.resolve({ rows: [] });
        }
        return Promise.resolve({ rows: [] });
      })
    };
  });

  test('GET /api/health returns ok', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: 'ok', db: 'ready' });
  });

  test('GET /api/transactions returns array', async () => {
    const response = await request(app).get('/api/transactions');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
