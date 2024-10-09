const express = require('express');
const login = require('./Routers/AuthRelated/Login');
const register = require('./Routers/AuthRelated/Register');
const adminMiddleware = require('./Helper/adminMiddleware');
const addAdmin = require('./Routers/AdminRelated/addAdmin');
const addTopic = require('./Routers/AdminRelated/addTopic');
const addQuestion = require('./Routers/AdminRelated/addQuestion');
const router = express.Router();

router.post('/login',login)
router.post('/register',register)
router.post('/addAdmin',adminMiddleware,addAdmin)
router.post('/addTopic',adminMiddleware,addTopic)
router.post('/addQuestion',adminMiddleware,addQuestion)




module.exports=router