const mongoose = require('mongoose');
const {Schema} = mongoose;

const productSchema =  new Schema({
    title:{type:String,required:true,unique:true},
    description:{type:String,required:true},
    price:{type:Number,required:true,min:[1,'wrong min price'], max:[10000,'wrong max price']},
    discountPercentage:{type:Number,required:true,min:[1,'wrong min discount'], max:[99,'wrong max dicount']},
    rating:{type:Number,required:true,min:[0,'wrong min rating'], max:[5,'wrong max rating'],default:0},
    stock:{type:Number,required:true,min:[1,'wrong min stock'], default:0},
    brand:{type:String,required:true},
    category:{type:String,required:true},
    thumbnail:{type:String,required:true},
    images:{type:[String],required:true},
    // although here colors and sizes are available it does not mean that colors and sizes would appear there because mainly most of the product there are the one who are added before the development so there colors and sizes are predefined but as soon as admin create a product so then he adds the colors and sizes which will appear in reality but these products are not created by admin so there colors are sizes are not available or not shown right now 
    colors:{type:[Schema.Types.Mixed]},
    sizes:{type:[Schema.Types.Mixed]},
    highlights:{type:[String]},
    deleted:{type:Boolean,default:false},
    
})
// here we are creating a virtual thing like whenever we will be fetching something from the database in our backend to show it on the frontend or to implement some logic so there it will show id rather than showing _id because in default databse generate id in the name as _id but in our frontend we have put logic all on the basis of 'id' not '_id' so this virtual thing make a virtual entery of name id which will copy the _id so it contains get and set 
const virtual =  productSchema.virtual('id');
virtual.get(function(){
    return this._id;
})
productSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform:function(doc,ret){delete ret._id}
})
exports.Product =  mongoose.model('Product',productSchema);