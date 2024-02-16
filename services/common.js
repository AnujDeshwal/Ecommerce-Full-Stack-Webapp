const passport = require("passport");

exports.isAuth= (req,res,done)=>{
    return passport.authenticate('jwt');
}
// basically here we did sanitizatiion of user means sensitive things will not be sent with the user only user id and user role so whereever we will have to save user info like in session or sending to the frontend so there we will return this santized user 
exports.sanitizeUser=(user)=>{
    return {id:user.id,role:user.role};
}

exports.cookieExtractor = function(req){
    let token = null;
    // if(req&&req.cookies){
    //     token = req.cookies['jwt'] ;
    // }
    token= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1Y2UyNTVjYzRmOTMzYTA1ZGIzMWI0MyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzA4MTA0Nzc0fQ.6v16BecljV5C8qzrx_C9jgFwLYq-gTmIpOpOjbD8We4';
    return token;
}
