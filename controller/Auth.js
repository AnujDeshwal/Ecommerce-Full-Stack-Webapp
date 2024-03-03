const { User } = require("../model/User")
const crypto  = require('crypto');

const jwt = require('jsonwebtoken');
const { sanitizeUser } = require("../services/common");
// Create User means sign up so it would in authentication section 
exports.createUser= async(req,res)=>{
    //this req.body will get from the frontend ,basically whatever product we would have to sell they all will be added by the admin by frontend so that whole data would come from the frontend and we be parsed by the middleware express.json() because data would be in the form of json 
    // const user = new User(req.body)
    try{
        // want to know about this salt go to index file then go to crypto part 
        const salt = crypto.randomBytes(16);
        crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256',async function(err, hashedPassword) {
            // basically abover we were taking the user from the req.body and were saving it in the database but right now we are saving the hashedPassword now real password using crypto library , here we are using spread operator in which we are changing from real password to hashedPassword and we are saving salt as well because it will help use to verify the password during login 
            // basically when we doing login then only that passport js is working and after getting verified through the strategy then only it is creating req.user where we have user in the session ,now it means while signup session would not be created because vo login ke wakt banta hai sirf then int the passport js documentation they have mentioned if you want to make a sessino manually and put the user info in it so you can use req.login function where first arguement would be info to put inside of session and second is just callback function , we did this because we want that after signup also a session should be created 
            const user = new User({...req.body,password:hashedPassword,salt});
            const doc = await user.save()
            // this req.login also calls serializer and adds to session 
            req.login(sanitizeUser(doc),(err)=>{
                if(err){
                    res.status(400).json(err);
                }
                else{
                    const token=jwt.sign(sanitizeUser(doc), process.env.JWT_SECRET_KEY);
                    // 3600000 is in milisecond it is equal to 1 hr 
                    // here we basically user ke cookie mai jwt token save kara rahe hai 
                    res.cookie('jwt', token, { expires: new Date(Date.now() + 3600000), httpOnly: true }).status(201).json({id:doc.id,role:doc.role})
                }
            })
            // Product.save is different from insert because if you will provide id to it so it will behave as update but if no id so it will work as normal insertion 
             
        });
    }catch(err){
        console.log(error)
        res.status(400).json(err)
    }
}
exports.loginUser = async(req,res)=>{
    // we are setting the user cookie here for 1 hr with jwt token 
    const user = req.user;
    res.cookie('jwt', req.user.token, { expires: new Date(Date.now() + 3600000), httpOnly: true })
    // console.log(req.User)
    res.json(req.user);
}
// this checkAuth we made because when we are logged in and if you will refresh the page so you will redirect to the login page and you will have to login again but here now after someone will refresh so first we will check in the backend if user still exist means if it is still logged in so we will not redirect him in the login page rather will redirect to home page 
exports.checkAuth = async(req,res)=>{
    // req.user exist karta hai means user still exist because req.user is made by passport js after authentication of a user 
    if(req.user){
        res.json(req.user)
    }else{
        // exist nahi karta 
        res.sendStatus(401);
    }
}