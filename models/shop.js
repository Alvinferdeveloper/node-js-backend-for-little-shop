const {Schema, model} = require('mongoose');

const shopSchema = new Schema({
    name:{type: String,required:true},
    nameOFOwner: {type: String,required:true},
    departamento: {type: String,required:false},
    municipio: {type: String,required:false},
    city:{type: String,required:true},
    password: {type: String,required:true},
    email:{type: String,required:true},
    exactDirection: {type: String,required:false},
    phone: {type: String,required:true},
    rol:{type:String,default:"shop"},
    likes:{type:Array,required:false},
});

module.exports = model("shops",shopSchema);