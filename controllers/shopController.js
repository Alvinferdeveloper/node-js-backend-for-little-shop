const validator = require('validator');
const bcrypt = require("bcrypt");
const shop= require('../models/shop');
const generateShopToken = require('../services/shopJwt');
const subir = require('../settings/pruebafirebase');

const addShop = async (req,res)=>{
    const {name,password,departamento,municipio,city,exactDirection,phone} = req.body;
    if(!name || !password || !phone,!departamento || !municipio,!city){
        return res.status(400).json({error:'Informacion necesaria incompleta',status: 400});
    }

    const nameValid = validator.isLength(name,{min:2,max:undefined});
    const passwordIsValid = /\d/.test(password) && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[^a-zA-Z\d]/.test(password);
    const phoneIsvalid = phone.length==8 && true;
    const departamentoIsValid = validator.isLength(departamento,{min:3,max:undefined});
    const municipioIsValid = validator.isLength(municipio,{min:3,max:undefined});
    const cityIsValid = validator.isLength(city,{min:3,max:undefined});

    if(!nameValid || !passwordIsValid || !phoneIsvalid || !departamentoIsValid || !municipioIsValid || !cityIsValid){
        return res.status(400).json({error:"Alguno de los campos no es valido"});
    }

    let encryptedPassword;
    try{
        encryptedPassword = await bcrypt.hash(password,10)
    }
    catch{
        return res.status(400).json({error:"no se pudo hashear el password",status:400});
    }
    const shopToCreate = {
        ...req.body,
        password:encryptedPassword,

    }
    const shopCreated = new shop(shopToCreate);
    console.log(shopCreated);
    const token = generateShopToken(shopCreated);
    shopCreated.save().then((user)=>{
        console.log(user)
        return res.status(200).json({
            message:"tienda creado exitosamente",
            status:200,
            shop:{
                id:shopCreated.id,
                name,
                phone,
                departamento,
                municipio,
                city,
                exactDirection,
                rol:shopCreated.rol,
                token,
            }
    
        })
    }).catch(()=>{
        return res.status(400).json({error:"No se pudo guardar el usuario en la base de datos",status:400});
    });
};


const getShop = async (req,res)=>{
    const {id} = req.params;
    let shopgot;
    try {
        shopgot = await shop.findById(id);
        console.log(shopgot);
    }
    catch{
        return res.status(404).json({
            status:"error",
            message:"No se pudo encontrar la tienda"
        })
    }
    

    return res.status(200).json({
        status:"success",
        shopgot,
    });
}

module.exports = {
    addShop,
    getShop
};