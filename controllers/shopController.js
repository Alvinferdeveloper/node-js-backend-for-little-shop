const validator = require('validator');
const bcrypt = require("bcrypt");
const shop= require('../models/shop');
const generateShopToken = require('../services/shopJwt');
const upload = require('../services/pruebafirebase');

const addShop = async (req,res)=>{
    const {name,password,departamento,municipio,city,exactDirection,phone} = req.body;
    if(!name || !password || !phone,!departamento || !municipio || !city){
        return res.status(400).json({error:'Informacion necesaria incompleta',status: 400});
    }

    const numberExist = await shop.findOne({phone:phone});
    if(numberExist) return res.status(403).json({
        status:"error",
        message:"El numero ya existe"
    })

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


const getShopById = async (req,res)=>{
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


const getShop = async (req, res) =>{
    const {id} = req.shop;
    try{
        const shopgot = await shop.findById(id);
        return res.status(200).json({
            status: 'success',
            shopgot
        })
    }
    catch{
        return res.status(404).json({
            status: 'error',
            message:"No se encontro la tienda"
        });
    }
}

const shopLogin = async (req, res) => {
    const {phone,password} = req.body;
    const shopgot = await shop.findOne({phone:phone});
    if(!shopgot){
        return res.status(404).json({
            status: 'error',
            message: 'shop not found'
        });
    }

    const coinciden = await bcrypt.compare(password,shopgot.password);
    if(!coinciden){
        return res.status(404).json({
            status: 'error',
            message:'password incorrect',
        });
    }
    const payload = {
        id:shopgot.id,
        phone:shopgot.phone,
        name:shopgot.name,
        departamento:shopgot.departamento,
        municipio:shopgot.municipio,
        city:shopgot.city,
        exactDireccion:shopgot.exactDirection,
        rol:shopgot.rol,
    }
    const token = generateShopToken(payload);
    return res.status(200).json({
        status: 'success',
        message: 'Shop logged in successfully',
        payload,
        token
    });
};

const uploadShopPictures = async (req,res) => {
    const {files} = req;
    const {id} = req.shop;
    let url;
    let missing;
    let counter=0;
    try {
        let shopgot = await shop.findById(id);
        for (let picture of files){
                if(shopgot.pictures.length <= 10) {
                    url = await upload(picture,"shop");
                    shopgot.pictures.push(url);
                    shopgot.save();
                    counter++;
                }
                else {
                    missing=files.length-counter;
                }
            
        }


        res.status(200).json({
            status:"success",
            message:"Images uploaded successfully",
            shopgot,
            missing
        })
    }
    catch(err){
        console.log(err);
        res.status(404).json({
            status: 'error',
            message: 'Shop not found'
        })
    }
}

module.exports = {
    addShop,
    getShopById,
    getShop,
    shopLogin,
    uploadShopPictures
};