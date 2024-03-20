const express = require('express');
const { createUser,loginUser, checkAuth, resetPasswordRequest, resetPassword } = require('../controller/Auth');
const router = express.Router();
const passport = require('passport');
// /auth is alread added in the base path in the index.js 
router.post('/signup',createUser)
      .post('/login',passport.authenticate('local'),loginUser)
    //   basically neeche there is a middleware of jwt means first it will got his jwt strategy defined in the index js so where it extract the json webtoken from the user while user do request then it will fetch the payload from it where id is available then user info will be fetched then that info will be put in the req.user from where we are checking in the checkAuth api 
      .get('/check',passport.authenticate('jwt'),checkAuth)
      .post('/reset-password-request',resetPasswordRequest)
      .post('/reset-password',resetPassword)
exports.router = router