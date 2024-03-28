const mongoose = require('mongoose');
const {Schema} = mongoose;
// cart schema is important because if this is one where from the data is sent to the order so first change its schema for color and sizes so it will be automatically reflect in the order as well 
const cartSchema =  new Schema({
    quantity:{type:Number , required:true},
    // here we know that when we put data in the database so it make a unique id for each data so that id has a specific type so that is mentioned below and ref:'Product' is here you are directly giving the refrence of that product means now by this you can fetch all the details of the product same for the user 
    product:{type:Schema.Types.ObjectId , ref:'Product',required:true},
    user:{type:Schema.Types.ObjectId ,required:true},
    size :{type:Schema.Types.Mixed},
    color :{type:Schema.Types.Mixed },
   
})
// here we are creating a virtual thing like whenever we will be fetching something from the database in our backend to show it on the frontend or to implement some logic so there it will show id rather than showing _id because in default databse generate id in the name as _id but in our frontend we have put logic all on the basis of 'id' not '_id' so this virtual thing make a virtual entery of name id which will copy the _id so it contains get and set 
const virtual =  cartSchema.virtual('id');
virtual.get(function(){
    return this._id;
})
cartSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform:function(doc,ret){delete ret._id}
})
exports.Cart =  mongoose.model('Cart',cartSchema);     