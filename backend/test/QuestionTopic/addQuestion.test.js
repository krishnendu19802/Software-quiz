const request = require('supertest');
const { app, server } = require('../../index');
const db = require('../../config/database');
const jwt = require('jsonwebtoken');

// Insert dummy data before each test case
beforeEach(async () => {
    // await db.promise().query('DELETE FROM questions');  // Clear questions table
    // await db.promise().query('DELETE FROM topics');  // Clear topics table
    await db.promise().query('INSERT INTO topics (userId, topicName) VALUES (?, ?)', [1, 'Test Topic 2']);  // Insert an existing topic
});

// Clean up after all tests
afterAll(async () => {
    await db.promise().query(`delete from questions where topicId in (select topicId from topics where topicName='Test Topic 2')`)
    
    await db.promise().query(`delete from topics where topicName='Test Topic 2' OR topicName='New Topic 2'`)
    await db.promise().end();
    await server.close();
});

beforeAll(() => {
    process.env.PORT = 0;  // This will make the server choose an available random port
});

// Admin token
const adminToken = jwt.sign(
    { userId: 1, email: 'krish@gmail.com', admin: 1 },
    process.env.JWT_SECRET,
    { expiresIn: '7h' }
);

const wrongToken = jwt.sign(
    { userId: 133, email: 'user@gmail.com', admin: 0 },
    process.env.JWT_SECRET,
    { expiresIn: '7h' }
);

// Test cases for adding a question
const route = '/api/addquestion';

const cases = [
    { case: 'no token', token: null, status: 401, error: 'Access denied. No token provided.' },
    { case: 'Non Admin', token: wrongToken, status: 401, error: 'Access denied. Admin privileges required.' },
    { 
        case: 'with valid token and valid data', 
        token: adminToken, 
        body: { 
            topicName: 'Test Topic 2', 
            statement: 'What is the chemical formula of water?', 
            option1: 'H2O', 
            option2: 'CO2', 
            option3: 'O2', 
            option4: 'N2', 
            ansIndex: 1 
        }, 
        status: 201, 
        message: 'Question added successfully' 
    },
    { 
        case: 'with valid token but topic does not exist', 
        token: adminToken, 
        body: { 
            topicName: 'Non-Existing Topic', 
            statement: 'What is the chemical formula of water?', 
            option1: 'H2O', 
            option2: 'CO2', 
            option3: 'O2', 
            option4: 'N2', 
            ansIndex: 1 
        }, 
        status: 400, 
        error: 'Topic not found' 
    },
    { 
        case: 'missing statement', 
        token: adminToken, 
        body: { 
            topicName: 'Existing Topic', 
            statement: '', 
            option1: 'H2O', 
            option2: 'CO2', 
            option3: 'O2', 
            option4: 'N2', 
            ansIndex: 1 
        }, 
        status: 400, 
        error: 'Please provide valid topic name, statement, options, and answer index' 
    },
    { 
        case: 'missing options', 
        token: adminToken, 
        body: { 
            topicName: 'Existing Topic', 
            statement: 'What is the chemical formula of water?', 
            option1: '', 
            option2: '', 
            option3: '', 
            option4: '', 
            ansIndex: 1 
        }, 
        status: 400, 
        error: 'Please provide valid topic name, statement, options, and answer index' 
    },
    { 
        case: 'missing ansIndex', 
        token: adminToken, 
        body: { 
            topicName: 'Existing Topic', 
            statement: 'What is the chemical formula of water?', 
            option1: 'H2O', 
            option2: 'CO2', 
            option3: 'O2', 
            option4: 'N2', 
            ansIndex: null 
        }, 
        status: 400, 
        error: 'Please provide valid topic name, statement, options, and answer index' 
    }
];

describe('Add Question API', () => {
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
