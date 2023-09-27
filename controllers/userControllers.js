const validator = require('validator');
const bcrypt = require("bcrypt");
const user = require('../models/user');
const generateUserToken = require('../services/userJwt');
const subir = require('../settings/pruebafirebase');

const addUser = async (req,res)=>{
    const {name,password,phone,lastName} = req.body;
    console.log(req.body);
    if(!name || !password || !phone){
        return res.status(400).json({error:'Informacion necesaria incompleta',status: 400});
    }

    const nameValid = validator.isLength(name,{min:2,max:undefined});
    const passwordIsValid = /\d/.test(password) && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[^a-zA-Z\d]/.test(password);
    const phoneIsvalid = phone.length==8 && true;

    if(!nameValid || !passwordIsValid || !phoneIsvalid){
        return res.status(400).json({error:"Alguno de los campos no es valido"});
    }
    let encryptedPassword;
    try{
        encryptedPassword = await bcrypt.hash(password,10)
    }
    catch{
        return res.status(400).json({error:"no se pudo hashear el password",status:400});
    }
    const userToCreate = {
        name,
        password:encryptedPassword,
        phone,
        lastName: lastName && lastName,
    }
    const userCreated = new user(userToCreate);
    const token = generateUserToken(userCreated)
    userCreated.save().then((user)=>{
        return res.status(200).json({
            message:"Usuario creado exitosamente",
            status:200,
            user:{
                id:userCreated.id,
                name,
                lastName: lastName && lastName,
                phone,
                rol:userCreated.rol,
                token,
            }
    
        })
    }).catch(()=>{
        return res.status(400).json({error:"No se pudo guardar el usuario en la base de datos",status:400});
    });
};


const uploadProfile = async (req, res) => {
    const {file} = req;
    const {id} = req.user;
    if(!file) return res.status(404).json({status: 'error', message:"no se proporciono ningun archivo"})
    try {
       const url = await subir(file);
       const newUser = await user.findByIdAndUpdate(id,{profilePicture:url},{new:true}).select("-password").exec();
       console.log(newUser);
       res.status(200).json({
        status: 'success',
        newUser,
       });
    }
    catch{
        res.status(403).json({
            status: 'error',
            message:"No se pudo actualizar la foto de perfil",
        });
    }
};

module.exports = {
    addUser,
    uploadProfile
};