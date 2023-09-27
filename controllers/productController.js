const validator = require('validator');
const Product = require('../models/product')

const addProduct = (req,res)=>{
    const {name,price,availables} = req.body;
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
       ...req.body,
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
};


const getProduct = async (req,res) =>{
    const {id} = req.params;
    let product;
    try {
        product = await Product.findById(id);
        if(!product){
            return res.status(404).json({
                status:"error",
                message:"No se pudo encontrar el producto"
            });
        }
    }
    catch{
        return res.status(404).json({
            status:"error",
            message:"error al encontrar el producto"
        });
    }

    return res.status(200).json({
        status:"success",
        product
    });
}


module.exports = {
    addProduct,
    getProduct,
};