const request = require('supertest');
const { app, server } = require('../../index');
const db = require('../../config/database');

beforeEach(async () => {
    await db.promise().query('DELETE FROM users where userId!=1');  // Clear existing data except admin
});

afterAll(async () => {
    await db.promise().end();
    server.close();
});

const cases = [
    { case: 'both name, email, and password missing' }, // All missing
    { name: 'Admin', case: 'email and password missing' }, // Email and password missing
    { email: 'admin2@example.com', case: 'name and password missing' }, // Name and password missing
    { password: 'password', case: 'name and email missing' }, // Name and email missing
    { name: 'Admin', email: 'admin@example.com', case: 'password missing' }, // Password missing
    { name: 'Admin', password: 'password', case: 'email missing' }, // Email missing
    { name: 'Admin', email: 'admin@example.com', password: 'password' }, // Admin email already exists
    { name: 'New Admin', email: 'newadmin@example.com', password: 'password123' }, // Valid new admin
];

describe('Register API', () => {
    const route = '/api/register';

    cases.slice(0, 6).map((c) => {
        it(`should return 400 if ${c.case}`, async () => {
            const res = await request(app)
                .post(route)

                .send(c);

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'Please provide name, email, and password');
        });
    });



    it('should return 400 if user already exists', async () => {
        // Insert a user to simulate an existing user
        await db.promise().query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', ['Test User', 'test@example.com', 'hashedpassword123']);

        const res = await request(app)
            .post(route)
            .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'Email already exists');
    });

    it('should return 201 if user is registered successfully', async () => {
        const res = await request(app)
            .post(route)
            .send({ name: 'Test User', email: 'test2@example.com', password: 'password123' });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
    });
});
