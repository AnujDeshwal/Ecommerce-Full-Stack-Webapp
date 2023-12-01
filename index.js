const express = require('express');
const server = express();
const mongoose = require('mongoose');
const { createProduct } = require('./controller/Product');
const productsRouter = require('./routes/Products');
const categoriesRouter = require('./routes/Categories');
const brandsRouter = require('./routes/Brands');
const cors = require('cors')
const usersRouter = require('./routes/Users');
const authRouter = require('./routes/Auth');
const cartRouter = require('./routes/Carts');
const orderRouter = require('./routes/Orders');
// it is a default import we can name it anything so productsRouters
// const { productsRouters } = require('./routes/Products');
//middleware

main().catch(err => console.log(err))
// basically what we are doing from the frontend that we are calling 8080 port by running api but react frontend is in 3000 port so that is his port and he can not use or modify something in another port so ,8080 port would have to allow another port to Cross-Origin Resource Sharing(Cors) that why we are using the cors hereby it is allowing ,we were using the json server previously json server would have allowed for it already 
server.use(cors({
    // here we have to expose this header part because althorugh cors is allowed even after that it hides our header so that no body else use it but since we need to use this header on the frontend port we need to expose this header 
    exposedHeaders:['X-Total-Count'],
}))
//  this is when we are expecting a json data from the frontend or http request so it will be parsed in the req.body ,then we can get it from the req.body ,basically for parsing of json 
// basically parsing to the javascript object from the json 
server.use(express.json());
// below line is just a thing where we will be able to write all routings in an another page or we can say we are basically using express router to add a functionality like /product will be added in every routing if we do route by express router 
server.use( '/products',productsRouter.router);
server.use( '/categories',categoriesRouter.router);
server.use( '/brands',brandsRouter.router);
server.use( '/users',usersRouter.router);
server.use( '/auth',authRouter.router);
server.use( '/cart',cartRouter.router);
server.use( '/orders',orderRouter.router);


async function main(){
    await  mongoose.connect('mongodb://127.0.0.1/ecommerce');
    console.log('database connected');
}
server.get('/',(req,res)=>{
    res.json({status:'success'})
})


server.listen(8080,()=>{
    console.log("server started");
})