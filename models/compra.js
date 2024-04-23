const { Schema,model, default:mongoose} = require('mongoose');

const compraSchema = new Schema({
    id_product:{type:mongoose.Types.ObjectId,required:true},
    id_user:{type:mongoose.Types.ObjectId,required:true},
    cantidad:{type:Number,required:true},
    fecha:{type:Date,default:new Date().getTime()}
})

module.exports = model("compras",compraSchema);
