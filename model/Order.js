const mongoose = require('mongoose');
const {Schema} = mongoose;

const orderSchema =  new Schema({
   items:{type:[Schema.Types.Mixed],required:true},
   totalAmount:{type:Number},
   totalItems:{type:Number},
//    product:{type:Schema.Types.ObjectId , ref:'Product',required:true},
//  ref ka samajna hai go to cart model 
   user:{type:Schema.Types.ObjectId , ref:'User',required:true},
   paymentMethod:{type:String},
   status:{type:String,default:'pending'},
   selectedAddress:{type:[Schema.Types.Mixed],required:true}

})
// here we are creating a virtual thing like whenever we will be fetching something from the database in our backend to show it on the frontend or to implement some logic so there it will show id rather than showing _id because in default databse generate id in the name as _id but in our frontend we have put logic all on the basis of 'id' not '_id' so this virtual thing make a virtual entery of name id which will copy the _id so it contains get and set 
const virtual =  orderSchema.virtual('id');
virtual.get(function(){
    return this._id;
})
orderSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform:function(doc,ret){delete ret._id}
})
exports.Order =  mongoose.model('Order',orderSchema);