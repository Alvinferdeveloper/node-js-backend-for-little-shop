const compra = require('../models/compra');


const addCompra = async (req,res) => {
    const {idProduct,idUser,cantidad} = req.body;
    if(!idProduct || !idUser || !cantidad){
        return res.status(403).json({
            status:"error",
            message:"Falta informacion"
        })
    }

    try{
        const newCompra = new compra({id_product:idProduct,id_user:idUser,cantidad});
        newCompra.save();
        const comprasForThisUser = await compra.find({id_user:idUser});
        return res.status(200).json({
            status:"sucess",
            compras:comprasForThisUser
        })
    }
    catch(err){
        return res.status(500).json({
            status:"error",
            message:"Ocurrio un error inesperado"
        })
    }
}

module.exports = {
    addCompra
}