const { Schema, model, default:mongoose} = require('mongoose');


const carritoSchema = new Schema({
    id_product:{type:mongoose.Types.ObjectId,required:true,ref:"products"},
    id_user:{type:mongoose.Types.ObjectId,required:true,ref:"users"}
})

module.exports = model("carritos",carritoSchema);