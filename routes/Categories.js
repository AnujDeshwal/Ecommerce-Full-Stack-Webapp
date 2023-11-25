const express = require('express');
const { fetchCategories, createCategory } = require('../controller/Category');
const  router = express.Router(); 

// /categories is already added in the base path given in the router middleware used in the index.js

router.get('/',fetchCategories).post('/',createCategory);
exports.router= router;