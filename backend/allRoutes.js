const express = require('express');
const login = require('./Routers/Login');
const register = require('./Routers/Register');
const adminMiddleware = require('./Helper/adminMiddleware');
const addAdmin = require('./Routers/addAdmin');
const router = express.Router();

router.post('/login',login)
router.post('/register',register)
router.post('/addAdmin',adminMiddleware,addAdmin)


module.exports=router