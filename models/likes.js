const {Schema, model, default: mongoose} = require('mongoose');

const likeSchema = new Schema({
    idUser:{type:mongoose.Types.ObjectId,ref:"users"},
    idProduct:{type:mongoose.Types.ObjectId,ref:"products"}
});

module.exports = model("likes",likeSchema);