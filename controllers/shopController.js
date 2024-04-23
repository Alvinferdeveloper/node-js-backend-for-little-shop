const validator = require('validator');
const bcrypt = require("bcrypt");
const shop = require('../models/shop');
const generateShopToken = require('../services/shopJwt');
const { uploadPictureToCloud}= require('../services/firebaseActions');
const shopPicture = require('../models/shopPicture')

const addShop = async (req,res)=>{
    console.log(req.body)
    const {name,password,city,exactDirection,phone, email,nameOFOwner,departamento,municipio} = req.body;
    console.log(req.body)
    if(!name || !password || !phone || !city || !exactDirection || !email || !nameOFOwner) {
        return res.status(400).json({status:"error",message:"Faltan campos"});
    }

    const emailExist = await shop.findOne({email:email});
    if(emailExist) return res.status(403).json({
        status:"error",
        message:"El email ya existe"
    })

    const nameValid = validator.isLength(name,{min:2,max:undefined});
    const passwordIsValid = /\d/.test(password) && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[^a-zA-Z\d]/.test(password);
    const phoneIsvalid = phone.length==8 && true;
    const cityIsValid = validator.isLength(city,{min:3,max:undefined});
    const emailIsValid = validator.isEmail(email);

    if(!nameValid || !passwordIsValid || !phoneIsvalid || !cityIsValid || !emailIsValid){
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
            status: 'success',
            message:"tienda creado exitosamente",
            shop:{
                id:shopCreated.id,
                name,
                phone,
                email,
                nameOFOwner,
                departamento,
                municipio,
                city,
                exactDirection,
                rol:shopCreated.rol,
                token,
            }
    
        })
    }).catch((err)=>{
        console.log(err)
        return res.status(400).json({error:"No se pudo guardar el usuario en la base de datos",status:400});
    });
};


const getShopById = async (req,res)=>{
    const { id } = req.params;
    let shopgot;
    let shopPictures;


    try {
        shopgot = await shop.findById(id).select(["-password","-__v"]).exec();
        shopPictures = await shopPicture.find({id_shop:id}).select("-__v").exec();;
       
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            status:"error",
            message:"Error al encontrar la tienda"
        })
    }
    

    return res.status(200).json({
        status:"success",
        shop:shopgot,
        shopPictures
    });
}


const getShop = async (req, res) =>{
    const { id } = req.shop;
    try{
        const shopgot = await shop.findById(id).select("-__v").exec();
        const pictures = await shopPicture.find({id_shop:id}).select("-__v").exec();
        return res.status(200).json({
            status: 'success',
            shopgot,
            pictures
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
    const { files } = req;
    const { id } = req.shop;
    const BUCKET = "shop";
    const MAX_OF_PICTURES = 10;
    const picturesUploaded = [];
    let missing = 0;
    
    if(!files)
    return res.status(403).json({status:"error",message:"no se proporcionaron imagenes"});

    try {
        let picturesForThisShop = await shopPicture.find({id_shop:id});
        let counterOfPicturesSavedOnDb = picturesForThisShop.length;
        for (let picture of files){
                if(counterOfPicturesSavedOnDb <= MAX_OF_PICTURES) {
                    const { urlOfPicuture, fileName} = await uploadPictureToCloud(picture,BUCKET);
                    const pictureToSave = new shopPicture({
                        url: urlOfPicuture,
                        firebaseName:fileName,
                        id_shop:id,
                    });
                    const pictureUploaded = await pictureToSave.save();
                    picturesUploaded.push(pictureUploaded)
                    counterOfPicturesSavedOnDb++;
                }
                else {
                    missing++;
                }
            
        }

        if(missing!=0 && picturesUploaded.length==0)
        return res.status(403).json({
            status:"error",
            message:"Ya no se pueden agregar mas fotos a esta tienda"
        })

        return res.status(200).json({
            status:"success",
            message:"pictures uploaded successfully",
            picturesUploaded,
            missing
        })
    }
    catch(err){
        console.log(err)
        res.status(404).json({
            status: 'error',
            message: 'product not found'
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