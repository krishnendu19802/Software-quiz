const request = require('supertest');
const { app, server } = require('../../index');
const db = require('../../config/database');
const { encrypt } = require('../../Helper/PasswordHashing');
const jwt = require('jsonwebtoken');

// Insert dummy data before each test case
beforeEach(async () => {
    await db.promise().query('DELETE FROM users where userId != 1');  // Clear any existing data
    const hashedPassword = await encrypt('password123');
    await db.promise().query('INSERT INTO users (name, email, password, admin) VALUES (?, ?, ?, ?)', ['Admin User', 'admin@example.com', hashedPassword, 1]);  // Insert an admin user
});

// Clean up after all tests
afterAll(async () => {
    await db.promise().end();
    await server.close();
});

// Test cases for adding an admin
const adminToken = jwt.sign(
    { userId: 1, email: 'admin@example.com', admin: 1 },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
);
const route='/api/addadmin'
beforeAll(() => {
    process.env.PORT = 0;  // This will make the server choose an available random port
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

describe('Add Admin API', () => {
    cases.slice(0, 6).map((c) => {
        it(`should return 400 if ${c.case}`, async () => {
            const res = await request(app)
                .post(route)
                .set('Authorization', `Bearer ${adminToken}`)  // Providing the admin token
                .send(c);

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'Please provide name, email, and password');
        });
    });

    it('should return 409 if email already exists', async () => {
        const res = await request(app)
            .post(route)
            .set('Authorization', `Bearer ${adminToken}`)  // Providing the admin token
            .send(cases[6]);  // Trying to insert an admin with an existing email

        expect(res.statusCode).toEqual(409);
        expect(res.body).toHaveProperty('error', 'Email already in use');
    });

    it('should return 201 and create a new admin', async () => {
        const res = await request(app)
            .post(route)
            .set('Authorization', `Bearer ${adminToken}`)  // Providing the admin token
            .send(cases[7]);  // Providing valid inputs

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
    });

    it('should return 401 if no token is provided', async () => {
        const res = await request(app)
            .post(route)
            .send(cases[7]);  // No token provided

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error', 'Access denied. No token provided.');
    });

    it('should return 401 if the user is not an admin', async () => {
        const userToken = jwt.sign(
            { userId: 2, email: 'user@example.com', admin: 0 },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const res = await request(app)
            .post(route)
            .set('Authorization', `Bearer ${userToken}`)  // Non-admin user
            .send(cases[7]);

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error', 'Access denied. Admin privileges required.');
    });

    it('should return 401 if the token is expired', async () => {
        const expiredToken = jwt.sign(
            { userId: 1, email: 'admin@example.com', admin: 1 },
            process.env.JWT_SECRET,
            { expiresIn: '-1s' }  // Token expired
        );

        const res = await request(app)
            .post(route)
            .set('Authorization', `Bearer ${expiredToken}`)
            .send(cases[7]);

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error', 'Token expired. Please login again.');
    });
});
