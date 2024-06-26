const validator = require('validator');
const bcrypt = require("bcrypt");
const user = require('../models/user');
const generateUserToken = require('../services/userJwt');
const upload = require('../services/firebaseActions');

const addUser = async (req,res)=>{
    const {name,password,email,lastName} = req.body;
    console.log(req.body);
    if(!name || !password || !email){
        return res.status(400).json({error:'Informacion necesaria incompleta',status: 400});
    }

    const userWhitSameEmail = await user.findOne({email:email});
    if(userWhitSameEmail){
        return res.status(403).json({
            status:"error",
            message:"Este telefono ya esta siendo usado"
        })
    }
    const nameValid = validator.isLength(name,{min:2,max:undefined});
    const passwordIsValid = /\d/.test(password) && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[^a-zA-Z\d]/.test(password);
    const emailIsValid = validator.isEmail(email)

    if(!nameValid || !passwordIsValid || !emailIsValid){
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
        ...req.body,
        password: encryptedPassword
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
                lastName,
                email,
                rol:userCreated.rol,
                profilePicture:userCreated.profilePicture,
                token,
            }
    
        })
    }).catch(()=>{
        return res.status(400).json({error:"No se pudo guardar el usuario en la base de datos",status:400});
    });
};


const updateProfile = async (req, res) => {
    const {file} = req;
    const {id} = req.user;
    if(!file) return res.status(404).json({status: 'error', message:"no se proporciono ningun archivo"})
    try {
       const url = await upload(file,"user");
       const newUser = await user.findByIdAndUpdate(id,{profilePicture:url},{new:true}).select("-password").exec();
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


const getUser = async(req,res) =>{
    const { id } = req.user;
    const userRecovered = await user.findById(id);
    res.status(200).json({
        status: 'success',
        user:userRecovered,
    })
}

const userLogIn = async(req,res) =>{
    const { email,password } = req.body;
    console.log(req.body);
    const usergot = await user.findOne({email:email});
    if(!usergot){
        return res.status(404).json({
            status: 'error',
            message: 'User not found'
        });
    }

    const coinciden = await bcrypt.compare(password,usergot.password);
    if(!coinciden){
        return res.status(404).json({
            status: 'error',
            message:'password incorrect',
        });
    }
    const payload = {
        id:usergot.id,
        email:usergot.email,
        name:usergot.name,
        profilePicture:usergot.profilePicture,
        rol:usergot.rol,
        lastName:usergot.lastName,
    }
    const token = generateUserToken(payload);
    return res.status(200).json({
        status: 'success',
        message: 'User logged in successfully',
        payload,
        token
    });
}

module.exports = {
    addUser,
    updateProfile,
    getUser,
    userLogIn
};