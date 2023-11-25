const { Category } = require("../model/Category");
// This is basically a API 
exports.fetchCategories = async (req,res)=>{

    try{
        const categories =  await Category.find({}).exec;
        
        // ye ham response bhej rahe hai jiska format json hai 
        res.status(200).json(categories);
    }catch(err){
        res.status(400).json(err);
    }
}

exports.createCategory= async(req,res)=>{
    //this req.body will get from the frontend ,basically whatever product we would have to sell they all will be added by the admin by frontend so that whole data would come from the frontend and we be parsed by the middleware express.json() because data would be in the form of json 
    const category = new Category(req.body)
    try{
        const doc = await category.save()
        // Product.save is different from insert because if you will provide id to it so it will behave as update but if no id so it will work as normal insertion 
        res.status(201).json(doc)
    }catch(err){
        res.status(400).json(err)
    }
}