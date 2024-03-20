const passport = require("passport");
const nodemailer = require("nodemailer");
exports.isAuth= (req,res,done)=>{
    return passport.authenticate('jwt');
}
// basically here we did sanitizatiion of user means sensitive things will not be sent with the user only user id and user role so whereever we will have to save user info like in session or sending to the frontend so there we will return this santized user 
exports.sanitizeUser=(user)=>{
    return {id:user.id,role:user.role};
}

exports.cookieExtractor = function(req){
    let token = null;
    if(req&&req.cookies){
        token = req.cookies['jwt'] ;
    }
    // token= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1Y2UyNTVjYzRmOTMzYTA1ZGIzMWI0MyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzA4MTA0Nzc0fQ.6v16BecljV5C8qzrx_C9jgFwLYq-gTmIpOpOjbD8We4';
    return token;
}
//Email
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "anujdeshwal95@gmail.com",
      pass: process.env.MAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
  }
  });

  //Mail endpoint
// we did like below thing was firstly a api /mail so by this way anyone could access this mail by just typing on the website in the url so we made it a function 
exports.sendMail = async function({to,subject,text,html}) {
  console.log("this is subject:",subject)  
    // send mail with defi  ned transport object and transport object is made above , very far above
    // basically whatever will be shown in the user email like click in this link to reset the password everything is shown by those four think available in the parameter 
    let info = await transporter.sendMail({
      //from would be fix because always i will be the one who send the email to other from the id : anujdeshwal95@gmail.com
      from: '"E-commerce" <anujdeshwal95@gmail.com>', // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    }).catch(error => console.log("this is the  error:",error));
    return info;
  };