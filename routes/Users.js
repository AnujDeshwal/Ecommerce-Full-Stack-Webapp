const express = require('express');
const { fetchUserById, updateUser } = require('../controller/User');
const  router = express.Router(); 

// /users is already added in the base path given in the router middleware used in the index.js
router.get('/own',fetchUserById)
      .patch('/:id',updateUser) 
exports.router= router;