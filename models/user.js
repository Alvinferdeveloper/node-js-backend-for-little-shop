const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    name:{type: String,required:true},
    lastName:{type: String,required:false},
    password:{type: String,required:true},
    phone:{type: String,required:true},
    rol:{type:String,default:"user"},
    profilePicture:{type: String,required:false,default:'gs://hackaton-proyect-77b35.appspot.com/usuario/default_perfil.png'}
});

module.exports = model("users",userSchema);