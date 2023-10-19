const {Schema, model, default: mongoose} = require('mongoose');

const productSchema = new Schema({
    name:{type: String,required:true},
    features: {type:Array,required:false},
    description: {type: String,required:false},
    price:{type:Number,required:true},
    availables:{type:Number,required:true},
    category:{type:String,enum:["barro","pintura","otro"]},
    rating:{type:Number,enum:[1,2,3,4,5]},
    id_shop:{type:mongoose.Types.ObjectId,ref:"shops",required:true},
})

module.exports = model("products",productSchema);