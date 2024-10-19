const express = require('express');
const login = require('./Routers/AuthRelated/Login');
const register = require('./Routers/AuthRelated/Register');
const adminMiddleware = require('./Helper/adminMiddleware');
const addAdmin = require('./Routers/AdminRelated/addAdmin');
const addTopic = require('./Routers/AdminRelated/addTopic');
const addQuestion = require('./Routers/AdminRelated/addQuestion');
const getTopics = require('./Routers/UserRelated/getTopics');
const userMiddleware = require('./Helper/userMiddleware');
const getQuestions = require('./Routers/UserRelated/getQuestions');
const submitQuiz = require('./Routers/UserRelated/submitQuiz');
const getProfile = require('./Routers/UserRelated/getProfile');
const getLeaderboard = require('./Routers/UserRelated/getLeaderBoard');
const router = express.Router();

//get requests
router.get('/getTopics',getTopics)
router.get('/getQuestions/:topicId',userMiddleware,getQuestions)
router.get('/getProfile',userMiddleware,getProfile)
router.get('/getLeaderBoard',userMiddleware,getLeaderboard)




//post requests
router.post('/login',login)
router.post('/register',register)
router.post('/addAdmin',adminMiddleware,addAdmin)
router.post('/addTopic',adminMiddleware,addTopic)
router.post('/addQuestion',adminMiddleware,addQuestion)
router.post('/submitQuiz',userMiddleware,submitQuiz)







module.exports=router