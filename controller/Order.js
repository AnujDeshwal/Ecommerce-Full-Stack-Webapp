const { Cart } = require("../model/Cart");
const { Order } = require("../model/Order");
const { Product } = require("../model/Product");
const { User } = require("../model/User");
const { sendMail, invoiceTemplate } = require("../services/common");
// This is basically a API 
exports.fetchOrderByUser = async (req,res)=>{
    // right now req.user has id and role 
    const {id} = req.user;
    try{
        // here it is very important concept that in the cart collection or table there is only three field which are productid by name product , user id by name user and quantity so here we have given referenec to the product column in the cart table ,go to  cart model so by refrenece we can pupulate or get the whole information about the product by the product tabel ,you can do like run this url in the postman 
        // /cart?user=6561eab4a4fbcb99cc4d468d this url is running below query so you can see you are getting all the details of the  product 
        const orders =  await Order.find({user:id});
        // ye ham response bhej rahe hai jiska format json hai 
        res.status(200).json(orders);
    }catch(err){
        res.status(400).json(err);
    }
} 

exports.createOrder= async(req,res)=>{
    //this req.body will get from the frontend ,basically whatever product we would have to sell they all will be added by the admin by frontend so that whole data would come from the frontend and we be parsed by the middleware express.json() because data would be in the form of json 
    const order = new Order(req.body)
    // for all items just decrement their stock by 1 
    for(let item of order.items){
        const product = await Product.findOne({_id:item.product.id});
        product.$inc('stock',-1*item.quantity);
        await product.save(); 
    }
    try{
        const doc = await order.save()
        // remember that user id is resided in the order.user in the orderSchema
        const user = await User.findById(order.user);
        // basically below sendMali could be done with await but do not do this because here , response is needed to send to frontend that yes order is created so then frontend will do its work but if you will add await here so then it will block res.status until mail is sent successfully which could make a delay because sending mail take significant amount of time to be sent , so we do not need that first email should go , then response 
        // console.log(user.email)  
        sendMail({to:user.email,html:invoiceTemplate(order),subject:"Order is created"})
        // Product.save is different from insert because if you will provide id to it so it will behave as update but if no id so it will work as normal insertion 
        res.status(201).json(doc)
    }catch(err){
        console.log(err)
        res.status(400).json(err)
    }
}

exports.deleteOrder= async(req,res)=>{ 
    const {id} = req.params;
    try{
       const order = await Order.findByIdAndDelete(id);
        res.status(201).json(order)
    }catch(err){
        res.status(400).json(err)
    }
}

exports.updateOrder = async (req,res)=>{
    const {id} =  req.params;
    // params give you the part you write after the url like if url is /product and you use like 
    // /product/2 so here 2 will come in the params 
    try{
        // here basically in the req.body we will send the updated product and basically findByIdAndUpdate function send the old document not updated one so we ordered him new:true means send the updated document because we want updated product in our frontend
        const order = await Order.findByIdAndUpdate(id,req.body,{new:true});
        // in the findByIdAndUpdate you generally send only those field of the document which is to be updated 
        res.status(200).json(order)
    }catch(err){
        res.status(400).json(err)
    }
}
exports.fetchAllOrders= async(req,res)=>{
    //this req.body will get from the frontend ,basically whatever product we would have to sell they all will be added by the admin by frontend so that whole data would come from the frontend and we be parsed by the middleware express.json() because data would be in the form of json 
    // here filter will come as object like //filter = {"category":["smartphones", "clothes"]}
    //sort ={_sort:"price",_order:"desc"}
    //pagination={_page:1 , _limit=10}
    let  query = Order.find({deleted:{$ne:true}});
    // those products whose deleted is false that product should be appeared in the user section only and those who are deleted they would be in the admin section so that when those product would be available so admin will again make it available 
    let  totalOrdersQuery = Order.find({deleted:{$ne:true}});
    // In Express. js, req. query is an object containing a set of key-value pairs representing the query parameters of the URL. This object is used to get the values of query parameters, which are appended to the end of the URL after a question mark.
    
    // i am applying all these filter on a same "query" variable because first of all , all products which are of category mentioned would come in it then , in those filter category brand would be choosen that which brand is needed so brand filter would be applied on that category if category was provided then sort would be app lied and also remember that these commands of dbms are promises so they wouuld be working in the background 

    const totalDocs = await totalOrdersQuery.count().exec();  
 
    if(req.query._sort && req.query._order){
        query =  query.sort({[req.query._sort]:req.query._order})

    }

    
    if(req.query._page && req.query._limit){
        const pageSize = req.query._limit;
        const page = req.query._page;
        query = query.skip(pageSize*(page-1)).limit(pageSize);
    }

    try{
        const doc = await query.exec()
        // console.log("this is doc"+ doc)
        // this is to set or make new field in header section because while using the json server we were using the X-total-count to get the total product ina particular page 
        // about clone it is in the notes.txt 
        // const totalDocs = await query.clone().count().exec();
       

        res.set('X-Total-Count',totalDocs);
        // Product.save is different from insert because if you will provide id to it so it will behave as update but if no id so it will work as normal insertion 
       
        res.status(200).json(doc)
    }catch(err){
        res.status(400).json(err)
    }
}

 