const express = require('express');
const login = require('./Routers/Login');
const register = require('./Routers/Register');
const router = express.Router();

router.post('/login',login)
router.post('/register',register)

module.exports=router