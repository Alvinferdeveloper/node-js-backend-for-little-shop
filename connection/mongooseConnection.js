const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/hackaton_proyect').then(res=>{
    console.log("connected");
}).catch(err=>{
    console.log("no se pudo conectar");
})