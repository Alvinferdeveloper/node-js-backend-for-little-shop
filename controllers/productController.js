const validator = require('validator');
const Product = require('../models/product')

const addProduct = (req,res,next)=>{
    const {name,price,availables,features,description,category,rating} = req.body;
    const {id:id_shop} = req.shop;
    if(!name || !price || !availables){
        return res.status(403).json({
            status:"error",
            message:"informacion necesaria incompleta",
        })
    }

    const priceIsaNumber = !isNaN(price);
    const availablesIsaNumber = !isNaN(availables);
    const nameIsValid = validator.isLength(name,{min:3,max:undefined});
    if(!priceIsaNumber || !availablesIsaNumber || !nameIsValid){
        return res.status(403).json({
            status:"error",
            message:"Alguna informacion no esta en el formato correcto"
        })
    }

    const productToAdd = {
        name,
        price,
        availables,
        features: features && features,
        description:description && description,
        category:category && category,
        rating: rating && rating,
        id_shop
    }

    const product = new Product(productToAdd);
    product.save().then((prod)=>{
        res.status(200).json({
            status:"sucess",
            prod,
        })
    }).catch(()=>{
        res.status(403).json({
            status:"error",
            message:"No se pudo agregarer el producto"
        })
    })
}


module.exports = addProduct;