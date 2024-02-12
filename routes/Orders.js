const express = require('express');
const { createOrder, fetchOrderByUser, deleteOrder, updateOrder, fetchAllOrders } = require('../controller/Order');
const  router = express.Router(); 

// /orders is already added in the base path given in the router middleware used in the index.js
// means /product toh juda hua hi hai uske aage se hi saari routing hogi jab tak express.Router use karoge 
// this router is also chainable rather than writing router.get just route.post ke aage hi .get lagado
router.post('/',createOrder) 
      .get('/user/:userId',fetchOrderByUser)
      .get('/',fetchAllOrders)
      .delete('/:id',deleteOrder)
      .patch('/:id',updateOrder)    
exports.router= router;