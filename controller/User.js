const { User } = require("../model/User");
// This is basically a API 
exports.fetchUserById = async (req,res)=>{
    console.log("fron own ")
 const {id} = req.user;
    try{
        // here we applied projection in which we select which field is wanted so only these field will come ,so here i select name ,email and id only to come 
        const user =  await User.findById(id);
        
        // ye ham response bhej rahe hai jiska format json hai
        res.status(200).json({id:user.id,addresses:user.addresses,email:user.email,role:user.role});
    }catch(err){
        res.status(400).json(err);
    }
}

exports.updateUser = async (req,res)=>{
    const {id} =  req.params;
    
    try{
        // here basically in the req.body we will send the updated product and basically findByIdAndUpdate function send the old document not updated one so we ordered him new:true means send the updated document because we want updated product in our frontend
        const user = await User.findByIdAndUpdate(id,req.body,{new:true});
        // in the findByIdAndUpdate you generally send only those field of the document which is to be updated 
        res.status(200).json(user)
    }catch(err){
        res.status(400).json(err)
    }
}