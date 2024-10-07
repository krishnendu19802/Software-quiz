const request = require('supertest');
const {app,server} = require('../../index');
const db = require('../../config/database');
const { encrypt } = require('../../Helper/PasswordHashing');

// Insert dummy data before each test case
beforeEach(async () => {
    await db.promise().query('DELETE FROM users where userId!=1');  // Clear any existing data
    const hashedPassword = await encrypt('password123');
    await db.promise().query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', ['Test User', 'test@example.com', hashedPassword]);
});

// Clean up after all tests

const cases=[
    {case:'both email and password missing'},//both missing
    {email:'email',case:'password missing'},//password missing
    {password:'pwd',case:'email missing'},//email missing
    {email:'invalid email',password:'pwd'},//invalid email
    {email:'test@example.com',password:'pwd'},//right email wrong password
    {email:'test@example.com',password:'password123'}//everything right
]
const route='/api/login'
afterAll(async () => {
    await db.promise().end();
    server.close()
    // process.exit(0)
});
describe('Login API', () => {
    

    cases.slice(0,3).map((c)=>{
        it(`should return 400 if ${c.case}`, async () => {
            const res = await request(app)
                .post(route)
                .send(c);  // Empty email and password
    
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'Please provide both email and password');
        });
    })

    it('should return 404 if user is not found', async () => {
        const res = await request(app)
            .post(route)
            .send(cases[3]);

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('error', 'User not found');
    });

    it('should return 401 if the password is incorrect', async () => {
        const res = await request(app)
            .post(route)
            .send(cases[4]);

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error', 'Invalid password');
    });

    it('should return 200 and a token for successful login', async () => {
        const res = await request(app)
            .post(route)
            .send(cases[5]);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Login successful');
        expect(res.body).toHaveProperty('token');
    });

   
});
