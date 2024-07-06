const { Cart } = require("../model/Cart");
// This is basically a API 
exports.fetchCartByUser = async (req,res)=>{
    console.log("from fetcchCartByUser")
    const {id} = req.user;
    try{
        
        // here it is very important concept that in the cart collection or table there is only three field which are productid by name product , user id by name user and quantity so here we have given referenec to the product column in the cart table ,go to  cart model so by refrenece we can pupulate or get the whole information about the product by the product tabel ,you can do like run this url in the postman 
        // /cart?user=6561eab4a4fbcb99cc4d468d this url is running below query so you can see you are getting all the details of the  product 
        const cartItems =  await Cart.find({user:id}).populate('product');
        // ye ham response bhej rahe hai jiska format json hai 
        res.status(200).json(cartItems);
    }catch(err){
        res.status(400).json(err);
    }
}

exports.addToCart= async(req,res)=>{
    //this req.body will get from the frontend ,basically whatever product we would have to sell they all will be added by the admin by frontend so that whole data would come from the frontend and we be parsed by the middleware express.json() because data would be in the form of json 
    const {id} = req.user;
    const cart = new Cart({...req.body,user:id});
    try{
        const doc = await cart.save()
        const result = await doc.populate('product')
        // populate karke bhejna is important because in the cart table we just have the product id , user id and quantity so we are populating the product by the product id present by refrence 
        // Product.save is different from insert because if you will provide id to it so it will behave as update but if no id so it will work as normal insertion 
        res.status(201).json(result)
    }catch(err){
        res.status(400).json(err)
    }
}

exports.deleteFromCart= async(req,res)=>{ 
    const {id} = req.params;
    try{
       const doc = await Cart.findByIdAndDelete(id);
        res.status(201).json(doc)
    }catch(err){
        res.status(400).json(err)
    }
}

exports.updateCart = async (req,res)=>{
    const {id} =  req.params;
    // params give you the part you write after the url like if url is /product and you use like 
    // /product/2 so here 2 will come in the params 
    try{
        // here basically in the req.body we will send the updated product and basically findByIdAndUpdate function send the old document not updated one so we ordered him new:true means send the updated document because we want updated product in our frontend
        const cart = await Cart.findByIdAndUpdate(id,req.body,{new:true});
        // in the findByIdAndUpdate you generally send only those field of the document which is to be updated 
        const result = await cart.populate('product');
        res.status(200).json(result )
    }catch(err){
        res.status(400).json(err)
    }
}

