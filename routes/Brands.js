const express = require('express');
const {  fetchBrands, createBrand, setBrands, updation } = require('../controller/Brand');
const  router = express.Router(); 

// /brands is already added in the base path given in the router middleware used in the index.js

router.get('/',fetchBrands).post('/',createBrand).get('/set',updation  );
exports.router= router;