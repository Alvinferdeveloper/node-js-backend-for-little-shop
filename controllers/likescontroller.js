const user = require('../models/user');
const shop = require('../models/shop');

const addToLikeToModel = async (req,res,model,idFrom,idProduct) => {
    try{
        const document = await model.findById(idFrom).select("-password").exec();
        if(!document) return res.status(404).json({
            status:error,
            message:`no existe el ${req.query.rol}`
        });
        const some = document.likes.some(like => like == idProduct);
        if(some) return res.status(403).json({
            status:"error",
            message:"some existe"
        });

        document.likes.push(idProduct);
        await document.save();
        console.log(document);
        res.status(200).json({
            status:'success',
            document
        })

    }
    catch(e){
        res.status(404).json({
            status:'error',
            message:"Error al encontrar el documento"
        });
    }
}

const addLike = (req,res) => {
    const USER_ROLE = "user";
    const SHOP_ROLE = "shop";
    const {idFrom,idProduct} = req.body;
    const {rol} = req.query;
    if(!rol || !idFrom || !idProduct) return res.status(403).json({
        status:"error",
        message:"Falta informacion"
    });

    if(rol.toLowerCase()==USER_ROLE)
        return addToLikeToModel(req,res,user,idFrom,idProduct)
    else if(rol.toLowerCase()==SHOP_ROLE)
        return addToLikeToModel(req,res,shop,idFrom,idProduct);
    else {
        return res.status(404).json({
            status:"error",
            message:"No se proporciono un rol valido"
        })
    }

}


module.exports = addLike;

