const request = require('supertest');
const { app, server } = require('../../index');
const db = require('../../config/database');
const jwt = require('jsonwebtoken');

describe('Quiz Submission Workflow', () => {
  let token,rsp;
  const user = {
    email: 'krish@gmail.com',
    password: 'krish',
    userId:1
  };

  const rtoken = jwt.sign(
    { userId: 1, email: 'krish@gmail.com', admin: 1 },
    process.env.JWT_SECRET,
    { expiresIn: '7h' }
);

const wrongToken = jwt.sign(
    { userId: 133, email: 'user@gmail.com', admin: 0 },
    process.env.JWT_SECRET,
    { expiresIn: '7h' }
);

  afterAll(async () => {
    await db.promise().end();
    server.close();
});

  
  it('should return 401 Unauthorized if no token is provided when fetching questions', async () => {
    const response = await request(app)
      .get('/api/getQuestions/98') 
      .send();

    expect(response.statusCode).toBe(401); 
    expect(response.body.error).toBe('Access denied. No token provided.'); 
  });

  

  
  it('should return quiz questions for a valid token', async () => {
    const response = await request(app)
      .get('/api/getQuestions/98') 
      .set('Authorization', `Bearer ${rtoken}`); 

    expect(response.statusCode).toBe(200); 
    expect(response.body).toBeInstanceOf(Array); 
    rsp=response.body.map((qs,ind)=>{
        return {questionId:qs.questionId, topicId:98, status:(ind%2)}
    })
  });

  it('should return 401 Unauthorized if no token is provided for quiz submission', async () => {
    const quizSubmissionData = {
      questions: rsp,
    };

    const response = await request(app)
      .post('/api/submitQuiz')
      .send(quizSubmissionData);

    expect(response.statusCode).toBe(401); 
    expect(response.body.error).toBe('Access denied. No token provided.');
  });

  it('should return 401 Unauthorized if invalid token is provided for quiz submission', async () => {
    const quizSubmissionData = {
      questions: rsp,
    };

    const response = await request(app)
      .post('/api/submitQuiz')
      .set('Authorization', `Bearer ${wrongToken}`) 
      .send(quizSubmissionData);

    expect(response.statusCode).toBe(401); 
    
  });

  
  it('should successfully submit the quiz with a valid token', async () => {
    const quizSubmissionData = {
      questions: rsp,
    };

    const response = await request(app)
      .post('/api/submitQuiz')
      .set('Authorization', `Bearer ${rtoken}`) 
      .send(quizSubmissionData);

    expect(response.statusCode).toBe(201); 
    expect(response.body.message).toBe('Quiz submitted successfully'); 
  });
});
