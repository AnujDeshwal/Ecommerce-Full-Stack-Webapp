const mongoose = require('mongoose');
const {Schema} = mongoose;

const productSchema =  new Schema({
    title:{type:String,required:true,unique:true},
    description:{type:String,required:true},
    price:{type:Number,required:true,min:[0,'wrong min price'], max:[10000000,'wrong max price']},
    discountPercentage:{type:Number,required:true,min:[0,'wrong min discount'], max:[99,'wrong max dicount']},
    rating:{type:Number,required:true,min:[0,'wrong min rating'], max:[5,'wrong max rating'],default:0},
    stock:{type:Number,required:true,min:[0,'wrong min stock'], default:0},
    brand:{type:String},
    category:{type:String,required:true},
    thumbnail:{type:String,required:true},
    images:{type:[String],required:true},
    // although here colors and sizes are available it does not mean that colors and sizes would appear there because mainly most of the product there are the one who are added before the development so there colors and sizes are predefined but as soon as admin create a product so then he adds the colors and sizes which will appear in reality but these products are not created by admin so there colors are sizes are not available or not shown right now 
    colors:{type:[Schema.Types.Mixed]},
    sizes:{type:[Schema.Types.Mixed]},
    highlights:{type:[String]},
    discountPrice:{type:Number}, 
    deleted:{type:Boolean,default:false},
    
})
// here we are creating a virtual thing like whenever we will be fetching something from the database in our backend to show it on the frontend or to implement some logic so there it will show id rather than showing _id because in default databse generate id in the name as _id but in our frontend we have put logic all on the basis of 'id' not '_id' so this virtual thing make a virtual entery of name id which will copy the _id so it contains get and set 
const virtualId =  productSchema.virtual('id');
virtualId.get(function(){
    return this._id;
})
// if you will see that there is not column of discountPrice in the schema but by making it virtually this way it will be shown to the user although it does not exist in the real database but in the mongo , in the object mongo mango will return such field also so you can make use of it in sort  , in the home there is a feature of sort where you can sort the product according to the price so it should be according to the discountPrice , because for user it is the real price so sorting should happen according to the discountPrice only  ,you can see this field just go to the home page open the network section in the inspect then go to the preview of the product api call , then there inside of the object it will be available , but here very important thing , later we realized that we can sort the product according to the virtual field , because sort is basically applied in the database but corresponding to the virtual field there will not be any value in the real database so you will not able to sort it so then we finally made our mind to make a real fiele of dicountPrice 
// const virtualDiscountPrice =  productSchema.virtual('discountPrice');
// virtualDiscountPrice.get(function(){
//     return Math.round(this.price*(1-this.discountPercentage/100));
// })
productSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform:function(doc,ret){delete ret._id}
})
exports.Product =  mongoose.model('Product',productSchema);