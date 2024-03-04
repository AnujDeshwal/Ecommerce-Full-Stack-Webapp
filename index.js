const express = require('express');
const server = express();
const mongoose = require('mongoose');
const { createProduct } = require('./controller/Product');
const productsRouter = require('./routes/Products');
const categoriesRouter = require('./routes/Categories');
const brandsRouter = require('./routes/Brands');
const cors = require('cors')
const JwtStrategy = require('passport-jwt').Strategy;
const  ExtractJwt = require('passport-jwt').ExtractJwt;
require('dotenv').config()
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const usersRouter = require('./routes/Users');
const authRouter = require('./routes/Auth');
const cartRouter = require('./routes/Carts');
const orderRouter = require('./routes/Orders');
const { sanitizeUser, isAuth, cookieExtractor } = require('./services/common');
const { User } = require('./model/User');
const crypto = require('crypto');
const path = require('path');
const { Order } = require('./model/Order');
//JWT options

const opts = {}
// here it is extracting the token from the user below cookieExtractor extractor extract kar raha hai it is a function defined by me so ye hi passport.use('jwt',()) waale ko call kar de raha hai other wise now route has a middleware as passport.authenticate('jwt')
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;

// it is a default import we can name it anything so productsRouters
// const { productsRouters } = require('./routes/Products');

//middleware
// below line is basically to server static files so that server will render this static files also so that poora frontend dikhega aapko , becaues previously we were just keep on adding the features and making things better so we did not make any build of the frontend but now we need to deploy the project so now we took the frontend in form of build and below it is the address of the build file 
server.use(express.static( path.resolve(__dirname ,'build'))) 
// cookieParser is for ki you take the data from req.cookies 
server.use(cookieParser());
// we created session for passport js 
// this below thing is for 
server.use(session({
    // is secret_key se hi sign and verificatin hoti hai us unique id ko session banata hai 
    secret: process.env.SESSION_KEY,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
}));

// the line server.use(passport.authenticate('session')); is used to initialize and set up Passport.js to authenticate requests using sessions.
server.use(passport.authenticate('session'));



// basically what we are doing from the frontend that we are calling 8080 port by running api but react frontend is in 3000 port so that is his port and he can not use or modify something in another port so ,8080 port would have to allow another port to Cross-Origin Resource Sharing(Cors) that why we are using the cors hereby it is allowing ,we were using the json server previously json server would have allowed for it already 
server.use(cors({
    // here we have to expose this header part because althorugh cors is allowed even after that it hides our header so that no body else use it but since we need to use this header on the frontend port we need to expose this header 
    exposedHeaders:['X-Total-Count'],
}))
  // ye neeche wala is important for webhook integration in the stripe means webhook mai jis form mai data aata hai from stripe server usko parse karna hota hai varna ese form ko parse karna hai  
  // here is the important thing to learn that in our backend whenever data is coming from the frontend or client so we are expecting the json data so hum express.json() to parse that data lagate hai but jab hamara client stripe hai means jab vo webhook mai data bhejega toh vo json data nahi bhejta vaha hame neeche waala raw parser chahiye hota hai so now neeche hum raw parser laga toh diya but express.json nahi chalega toh saari request kharab data jayega nahi aayega nahi so neeche waali line ko commment karna padega and do one thing that express.json() se pehle hi webhook ka poora code laga do so that vo raw parser use kar hi raha hai so initially mai raw parser lag jayega jab webhook chalega varna neeche json parser ka middleware laga diya humne 
// server.use(express.raw({type:'application/json'}));
server.use('/webhook', express.raw({type: "*/*"}))
//webhook

const endpointSecret = process.env.ENDPOINT_SECRET;
 
server.post('/webhook', async(request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      // here importance of webhook dikhegi aapko because through webhook only stripe can communicate to our server that payment intent is successed and we passed the order id in the metadata of the paymentintent so that when webhook url would be called by the stripe so it will provide us that metadata then we will mark the paymentstatus to received of that order ,listene order success page is the one shown by us there is no guarantee that payment has been received but through the webhook it is guaranteed that payment is received 
      const paymentIntentSucceeded = event.data.object;
      const order = await Order.findById(paymentIntentSucceeded.metadata.orderid);
      order.paymentStatus = 'received';
      await order.save();
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});



//  this is when we are expecting a json data from the frontend or http request so it will be parsed in the req.body ,then we can get it from the req.body ,basically for parsing of json 
// basically parsing to the javascript object from the json 

server.use(express.json());
// below line is just a thing where we will be able to write all routings in an another page or we can say we are basically using express router to add a functionality like /product will be added in every routing if we do route by express router 

// here we are doing like as soon as passport will authenticate or verify the user it will come to the isAuth , means after authentication passport do create the req.user(req.user mai user ki info daal deta hai passport js) so we will check, if req. user exist means yes authenticate ho chuka hai ,  which is acting as a middleware here and if iska callback function call hua then only ye aage api call maarne dega or ProductRouter.router tabhi chalega otherwise no response 
server.use( '/products',isAuth(),productsRouter.router);
server.use( '/categories',isAuth(),categoriesRouter.router);
server.use( '/brands',isAuth(),brandsRouter.router);
server.use( '/users',isAuth(),usersRouter.router);
// we did not put isAuth() here because auth ke baad hi isAuth() mai kuch aayega 
server.use( '/auth',authRouter.router);
server.use( '/cart',isAuth(),cartRouter.router);
//this /orderes is clashing  with react /orders
server.use( '/orders',isAuth(),orderRouter.router);
// this line we add to  make react router  work  in case of other routes doesnot match
server.get('*',(req,res)=> res.sendFile(path.resolve('build','index.html'))); 



//Passport strategies
// want to know about localstrategy go to nodejs folder 
passport.use('local', new LocalStrategy(
    // i changed the usernameField to email otherwise every where you have to put username in place of email because by default ye username hi expect karta hai 

    // ----------------------Is neeche waale cheej ne mujhe bahut pareshan kiya yll  ------------
    // In the absence of specifying the usernameField in your LocalStrategy configuration, Passport.js defaults to using the field named 'username' for identifying the username. If your frontend sends the username field with a different name (such as 'email'), Passport.js won't be able to find the username in the request body, leading to a bad request error (HTTP 400).
    {usernameField:'email'},
    //   So, in essence, when you call done(null, user), you're not returning a value in the traditional sense; instead, you're signaling to Passport.js that authentication was successful and providing it with the authenticated user object. Passport.js then continues processing the request based on this information, done is just a callback function which will signal the passport that whether authentication get successfull or failed , it takes three argument first error hai ya nahi , second is user ka info jo false dedo if user nahi mila and third is message.

    // The LocalStrategy extracts the username and password from the request automatically based on how you configure it. By default, Passport.js expects the username and password fields to be sent in the request body. 
    async function (email, password, done) {
        // by default passportjs uses username but here email would come in our case , because we are taking email from the user not username, so username variable ke andr email hoga 
        try{ 
            const user = await User.findOne({email:email}).exec();
            if(!user){
                // return basically isliye likh rahe hai so that done jaise hi kare toh function return ho jaye neeche ka code na chale , if apne every thing if else mai hai toh then retur likhne ki jaroorat nahi because then ek hi done chalega  
               return done(null , false , {message:'no such user email'});
            }
            // crypto is used to just hash the password then hashed password is saved to the database , salt value is important because when it decode that hashed password so it take use of salt so when we createuser during register or signup so at that time we are storing the salt info with the user data that is why it is taking the salt value from the user.salt
            crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256',
            // now jo aapne password diya use same salt se hashed kar raha hai and hashedPassword is the result 
             function(err, hashedPassword) {
                // neeche check kar raha hai if vo dono equal nahi hai toh kya kare 
                 if(!crypto.timingSafeEqual(user.password,hashedPassword)){
                    return  done(null , false , {message:'invalid credentials'});  
                  
                }
                // if equal hai toh neeche waali cheej 
                const token = jwt.sign(sanitizeUser(user),process.env.JWT_SECRET_KEY);
                // now very important that which ever value jo done ke second parameter mai jaati hai na vo hi req.user mai chali jaati hai , and koi bhi value gayi means authentication successfull 
               done(null , {id:user.id,role:user.role,token});//this lines send to serializer
                 
            });
            
        }catch(err){
            done(err);
        }
    }
  ));

  passport.use('jwt',new JwtStrategy(opts,async function(jwt_payload, done) {
        try{
        // When a request is made to a route protected by passport-jwt, the middleware intercepts the request and attempts to extract the JWT token from the request (e.g., from headers, query parameters, or cookies, depending on your configuration).

        // Decoding and Verification: Once the JWT is extracted, the passport-jwt strategy decodes and verifies the token using the configured secret or public key. If the token is valid, the strategy extracts the user information from the token's payload.
        
        // User Population: If the token is valid and the user information is successfully extracted, the passport-jwt strategy populates req.user with the extracted user information. This allows subsequent middleware or route handlers to access the authenticated user's details.

        const user = await User.findById( jwt_payload.id);
        if (user) {
            // ye neeche waala code req.user mai sanitizerUser daal dega pehle req.user mai token pada hua that after login 
            return done(null, sanitizeUser(user));//this calls serializer
        } else {
            return done(null, false);
            // or you could create a new account
        } 
    }catch(err){
        return done(err, false);
    }

}));

//   So, in essence, when you call done(null, user), you're not returning a value in the traditional sense; instead, you're signaling to Passport.js that authentication was successful and providing it with the authenticated user object. Passport.js then continues processing the request based on this information.
  passport.serializeUser(function(user, done) {
    process.nextTick(function() {
      return done(null, {id:user.id,role:user.role});
    });
  });
  
  passport.deserializeUser(function(user, done) {
    process.nextTick(function() {
      return done(null, user);
    }); 
  });

//payments
  
// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);
 


server.post("/create-payment-intent", async (req, res) => {
  const currentOrder = req.body;  
  // const {totalAmount} = req.body;
  const totalAmount = currentOrder.totalAmount;
const orderid = currentOrder.id;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount*100,//here we did multiply because in stripe it takes money in paisa means if 30 rs ka koi samaan hai so 3000 stripe ko bhejoge toh vo tab 30 rs samjega 
    currency: "INR", 
    // metadata is like giving the information about the order 
    metadata:{
      orderid
    }
  });
 
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

 



main().catch(err => console.log(err))


async function main(){
    await  mongoose.connect(process.env.MONGODB_URL);
    console.log('database connected');
}


server.listen(process.env.PORT,()=>{
    console.log("server started");
})


