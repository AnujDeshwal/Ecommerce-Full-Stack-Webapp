const { Brand } = require("../model/Brand");
// This is basically a API 
exports.fetchBrands = async (req,res)=>{

    try{
        const brands =  await Brand.find({}).exec;
        
        // ye ham response bhej rahe hai jiska format json hai 
        res.status(200).json(brands);
    }catch(err){
        res.status(400).json(err);
    }
}

exports.createBrand= async(req,res)=>{
    //this req.body will get from the frontend ,basically whatever product we would have to sell they all will be added by the admin by frontend so that whole data would come from the frontend and we be parsed by the middleware express.json() because data would be in the form of json 
    const brand = new Brand(req.body)
    try{
        const doc = await brand.save()
        // Product.save is different from insert because if you will provide id to it so it will behave as update but if no id so it will work as normal insertion 
        res.status(201).json(doc)
    }catch(err){
        res.status(400).json(err)
    }
}