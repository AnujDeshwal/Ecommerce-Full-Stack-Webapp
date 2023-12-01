const { User } = require("../model/User")

// Create User means sign up so it would in authentication section 
exports.createUser= async(req,res)=>{
    //this req.body will get from the frontend ,basically whatever product we would have to sell they all will be added by the admin by frontend so that whole data would come from the frontend and we be parsed by the middleware express.json() because data would be in the form of json 
    const user = new User(req.body)
    try{
        const doc = await user.save()
        // Product.save is different from insert because if you will provide id to it so it will behave as update but if no id so it will work as normal insertion 
        res.status(201).json(doc)
    }catch(err){
        console.log(error)
        res.status(400).json(err)
    }
}
exports.loginUser = async(req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email}).exec();
        if(!user){
            res.status(401).json({message:'no such user email'});
        } else if(user.password === req.body.password){
            // here you can see like we are doing kind of projection only sending some limited things from teh backend not all because there could be sensitive details in the backend ,which can not be sent to the frontend because it is not safe 
            res.status(200).json({id:user.id,email:user.email,name:user.name,addresses:user.addresses});
        }
        else{
            res.status(401).json({message:'invalid credentials'});  
        }
    }catch(err){
        console.log(err)
        res.status(400).json(err)
    }
}