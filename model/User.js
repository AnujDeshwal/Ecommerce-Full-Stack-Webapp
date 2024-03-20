const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema =  new Schema({
    email:{type:String,required:true,unique:true},
    password:{type:Buffer,required:true},
    role:{type:String,required:true,default:'user'},
    // this mixed is the mix of the various data structures  
    addresses:{type:[Schema.Types.Mixed]},
    name:{type:String},
    // orders:{type:[Schema.Types.Mixed]},
    //you are directly writing buffer means you are directly mentioned  buffer 
    salt:Buffer ,
    //this token will be made before hand of sending the mail to anyone so that when he will click on the link to reset the password so at time , he will come up with the same token which we generated beforehand so we will verify , it is because if anyone will get to know that in the url /auth/reset-password we can reset the password so any hacker would do it and reset the password so this is for authentication that you can only come on this url from our mail not from direct putting the url
    resetPasswordToken: {type:String,default:''}
}) 
const virtual =  userSchema.virtual('id');
virtual.get(function(){
    return this._id;
})
userSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform:function(doc,ret){delete ret._id}
})
exports.User =  mongoose.model('User',userSchema);