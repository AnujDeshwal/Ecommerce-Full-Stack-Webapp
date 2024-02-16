const passport = require("passport");

exports.isAuth= (req,res,done)=>{
    return passport.authenticate('jwt');
}
// basically here we did sanitizatiion of user means sensitive things will not be sent with the user only user id and user role so whereever we will have to save user info like in session or sending to the frontend so there we will return this santized user 
exports.sanitizeUser=(user)=>{
    return {id:user.id,role:user.role};
}