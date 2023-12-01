const express = require('express');
const { createUser,loginUser } = require('../controller/Auth');
const router = express.Router();
// /auth is alread added in the base path in the index.js 
router.post('/signup',createUser).post('/login',loginUser)
exports.router = router