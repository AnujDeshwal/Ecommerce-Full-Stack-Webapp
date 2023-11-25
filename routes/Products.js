const express = require('express');
const { createProduct, fetchAllProducts, fetchProductById, updateProduct } = require('../controller/Product');
const  router = express.Router(); 

// /product is already added in the base path given in the router middleware used in the index.js
// means /product toh juda hua hi hai uske aage se hi saari routing hogi jab tak express.Router use karoge 
// this router is also chainable rather than writing router.get just route.post ke aage hi .get lagado
router.post('/',createProduct)
      .get('/',fetchAllProducts)
      .get('/:id',fetchProductById)
      .patch('/:id',updateProduct)
exports.router= router;