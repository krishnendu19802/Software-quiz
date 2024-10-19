const request = require('supertest');
const { app, server } = require('../../index');
const db = require('../../config/database');
const jwt = require('jsonwebtoken');

// Insert dummy data before each test case
beforeEach(async () => {
    // await db.promise().query('DELETE FROM topics');  // Clear topics table
    await db.promise().query('INSERT INTO topics (userId,topicName) VALUES (?,?)', [1,'Existing Topic']);  // Insert an existing topic
});

// Clean up after all tests
afterAll(async () => {
    await db.promise().query(`delete from topics where topicName='Existing Topic' OR topicName='New Topic 2'`)
    await db.promise().end();
    await server.close();
});
beforeAll(() => {
    process.env.PORT = 0;  // This will make the server choose an available random port
});
// Admin token
const adminToken = jwt.sign(
    { userId: 1, email: 'krish@gmail', admin: 1 },
    process.env.JWT_SECRET,
    { expiresIn: '7h' }
);

const wrongToken=jwt.sign( {userId: 133, email: 'user@gmail', admin: 0 },
    process.env.JWT_SECRET,
    { expiresIn: '7h' })

// Test cases for adding a topic
const route = '/api/addtopic';

const cases = [
    { case: 'no token', token: null, status: 401, error: 'Access denied. No token provided.' },
    { case: 'Non Admin', token: wrongToken, status: 401, error: 'Access denied. Admin privileges required.' },
    { case: 'with valid token', token: adminToken, body: { topicName: 'New Topic 2' }, status: 201, message: 'Topic added successfully' },
    { case: 'same topic name', token: adminToken, body: { topicName: 'Existing Topic' }, status: 400, error: 'Topic already exists' },
    { case: 'missing topic name', token: adminToken, body: { topicName: '' }, status: 400, error: 'Topic name cannot be undefined or empty' },
];

describe('Add Topic API', () => {
    cases.map(c => {
        it(`should return ${c.status} when ${c.case}`, async () => {
            const res = await request(app)
                .post(route)
                .set('Authorization', c.token ? `Bearer ${c.token}` : '')  // Set token if provided
                .send(c.body || {});  // Send body if available

            expect(res.statusCode).toEqual(c.status);
            if (c.message) {
                expect(res.body).toHaveProperty('message', c.message);
            }
            if (c.error) {
                expect(res.body).toHaveProperty('error', c.error);
            }
        });
    });
});
