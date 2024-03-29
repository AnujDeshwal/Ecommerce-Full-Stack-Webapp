const express = require('express');
const { createProduct, fetchAllProducts, fetchProductById, updateProduct } = require('../controller/Product');
const { Product } = require('../model/Product');
const  router = express.Router(); 

// /products is already added in the base path given in the router middleware used in the index.js
// means /products toh juda hua hi hai uske aage se hi saari routing hogi jab tak express.Router use karoge 
// this router is also chainable rather than writing router.get just route.post ke aage hi .get lagado
router.post('/',createProduct)
      .get('/',fetchAllProducts)
      .get('/:id',fetchProductById)
      .patch('/:id',updateProduct)
      // basically problem was discountPrice can be added only if product is created by the admin so in the creation time only it will generate the discountPrice and add in the database but we were taking all the product from the dummyjson so we have not created them , that was the problem but we can update them because discountPrice is implemented in the updateProduct api as well so we updated them all through calling this api through postman 
      // .get(`/update/test`,async(req,res)=>{
      //       //For adding discountPrice to existing data: delete this code after use 
      //       const products = await Product.find({});
      //       for(let product of products){
      //             product.discountPrice = Math.round(product.price*(1-product.discountPercentage/100));
      //             await product.save();
      //         }
      //         res.send('ok');
      // })
exports.router= router;