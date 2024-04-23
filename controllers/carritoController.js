
const carrito = require('../models/carrito');

const addToCart = async (req,res) => {
    const { idUser,idProduct} = req.body;
    if(!idUser || !idProduct){
        return res.status(403).json({
            status:"error",
            message:"No se ingreso la informacion necesaria"
        })
    }

    try{
        const newCarrito = new carrito({id_product:idProduct,id_user:idUser});
        await newCarrito.save();
        const carritosForThisUser = await carrito.find({id_user:idUser});
        return res.status(200).json({
            status:"success",
            carrito:carritosForThisUser,
        })
    }
    catch(err){
        return res.json({
            status:"error",
            message:"Ocurrio un error al agregar el carrito"
        })
    }
}

module.exports = {
    addToCart
}