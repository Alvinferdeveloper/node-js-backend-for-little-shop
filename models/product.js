const {Schema, model, default: mongoose} = require('mongoose');

const productSchema = new Schema({
    name:{type: String,required:true},
    description: {type: String,required:false,required:true},
    price:{type:Number,required:true},
    availables:{type:Number,required:true},
    category:{type:String,enum:["Barro","Pintura",'Juguetes','Pulseras','Bolsos'],required:true},
    rating:{type:Number,enum:[1,2,3,4,5]},
    id_shop:{type:mongoose.Types.ObjectId,ref:"shops",required:true},
})

module.exports = model("products",productSchema);