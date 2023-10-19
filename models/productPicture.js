const { Schema, model, default:mongoose} = require('mongoose');

const productPictureSchema = new Schema({
    id_product:{type:mongoose.Types.ObjectId, require:true, ref:"products"},
    url:{type:String,required:true},
    firebaseName:{type:String, required:true},
});

module.exports = model("productPictures",productPictureSchema);
