const { Schema, model, default:mongoose} = require('mongoose');

const shopPictureSchema = new Schema({
    id_shop:{type:mongoose.Types.ObjectId,required:true,ref:"shops"},
    url:{type:String,required:true},
    firebaseName:{type:String,required:true}
})

module.exports = model("shopPictures",shopPictureSchema);