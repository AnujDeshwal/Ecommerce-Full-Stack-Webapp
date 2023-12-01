const express = require('express');
const { addToCart, fetchCartByUser, deleteFromCart, updateCart } = require('../controller/Cart');
const  router = express.Router(); 

// /cart is already added in the base path given in the router middleware used in the index.js
// means /product toh juda hua hi hai uske aage se hi saari routing hogi jab tak express.Router use karoge 
// this router is also chainable rather than writing router.get just route.post ke aage hi .get lagado
router.post('/',addToCart) 
      .get('/',fetchCartByUser)
      .delete('/:id',deleteFromCart)
      .patch('/:id',updateCart)
exports.router= router;