const request = require('supertest');
const { app, server } = require('../../index');
const db = require('../../config/database');
const jwt = require('jsonwebtoken');

beforeAll(() => {
    process.env.PORT = 0; // This will make the server choose an available random port
});

// Clean up after all tests
afterAll(async () => {
    await db.promise().end();
    await server.close();
});

// Admin token
const adminToken = jwt.sign(
    { userId: 1, email: 'krish@gmail', admin: 1 },
    process.env.JWT_SECRET,
    { expiresIn: '7h' }
);

const wrongToken = jwt.sign(
    { userId: 133, email: 'user@gmail', admin: 0 },
    process.env.JWT_SECRET,
    { expiresIn: '7h' }
);

// Test cases for fetching the profile
const route = '/api/getProfile';

const cases = [
    { case: 'no token', token: null, status: 401, error: 'Access denied. No token provided.' },
    { case: 'wrong token', token: wrongToken, status: 404, error: 'User not found' },
    { case: 'valid token', token: adminToken, status: 200 },
];

describe('Fetch Profile API', () => {
    cases.map(c => {
        it(`should return ${c.status} when ${c.case}`, async () => {
            const res = await request(app)
                .get(route)
                .set('Authorization', c.token ? `Bearer ${c.token}` : '') // Set token if provided

            expect(res.statusCode).toEqual(c.status);
            if (c.message) {
                expect(res.body).toHaveProperty('message', c.message);
            }
            if (c.error) {
                expect(res.body).toHaveProperty('error', c.error);
            }
            if (c.body) {
                expect(res.body).toMatchObject(c.body); // Check if the response body matches expected structure
            }
        });
    });
});
