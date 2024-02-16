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

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const SECRET_KEY = 'SECRET_KEY';
const jwt = require('jsonwebtoken');
const usersRouter = require('./routes/Users');
const authRouter = require('./routes/Auth');
const cartRouter = require('./routes/Carts');
const orderRouter = require('./routes/Orders');
const { sanitizeUser, isAuth, cookieExtractor } = require('./services/common');
const { User } = require('./model/User');
const crypto = require('crypto')

//JWT options

const opts = {}
// here it is extracting the token from the user below cookieExtractor extractor extract kar raha hai it is a function defined by me so ye hi passport.use('jwt',()) waale ko call kar de raha hai other wise now route has a middleware as passport.authenticate('jwt')
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY;

// it is a default import we can name it anything so productsRouters
// const { productsRouters } = require('./routes/Products');

//middleware
server.use(express.static('build'))
// cookieParser is for ki you take the data from req.cookies 
server.use(cookieParser());
// we created session for passport js 
// this below thing is for 
server.use(session({
    // is secret_key se hi sign and verificatin hoti hai us unique id ko session banata hai 
    secret: 'keyboard cat',
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
server.use( '/orders',isAuth(),orderRouter.router);

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
                const token = jwt.sign(sanitizeUser(user),SECRET_KEY);
                // now very important that which ever value jo done ke second parameter mai jaati hai na vo hi req.user mai chali jaati hai , and koi bhi value gayi means authentication successfull 
               done(null , {token});//this lines send to serializer
                
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

  main().catch(err => console.log(err))


async function main(){
    await  mongoose.connect('mongodb://127.0.0.1/ecommerce');
    console.log('database connected');
}


server.listen(8080,()=>{
    console.log("server started");
})


