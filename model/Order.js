const mongoose = require('mongoose');
const {Schema} = mongoose;
// when error will occur so this message will be shown , and about enum, it is mentionend below 
const paymentMethods = {values:['cash','card'],message:'enum validator failed for payment Methods'}
const orderSchema =  new Schema({
   items:{type:[Schema.Types.Mixed],required:true},
   totalAmount:{type:Number},
   totalItems:{type:Number},
//    product:{type:Schema.Types.ObjectId , ref:'Product',required:true},
//  ref ka samajna hai go to cart model 
   user:{type:Schema.Types.ObjectId , ref:'User',required:true},
//    this enum is basically that for paymentMethod , you can only input two things in this field either cash or card , if something else would come up from anywhere so it will through error that it is not in enum 
   paymentMethod:{type:String,required:true,enum:paymentMethods},
   paymentStatus:{type:String,default:'pending'},
   status:{type:String,default:'pending'},
   selectedAddress:{type:Schema.Types.Mixed,required:true}
// basically here we are giving timestamps , it do like when every you will create or update a document so it will show the created time and updatead time 
},{timestamps:true})
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