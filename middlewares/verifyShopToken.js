const jwt = require('jwt-simple');
const moment = require('moment');

const verifyShopToken = (req,res,next) =>{
    const {authorization} = req.headers;
    console.log(authorization);
    if(!authorization){
        return res.status(403).json({
            status:"error",
            message:"No se proporciono ningun token",
        })
    }
    let payload;
    try{
        payload =  jwt.decode(authorization,process.env.SECRET);
        if(payload.exp < moment().unix()){
           return res.json({
                status:"error",
                message:"El token ha expirado",
            })
        }
    }
    catch{
        return res.json({
            status:"error",
            message:"El token es invalido"
        })
    }

    if(payload.rol != "shop"){
        return res.status(403).json({
            status:"error",
            message:"No tienes acceso a esta ruta"
        })
    }

    req.shop = payload;
    next();

}

module.exports = verifyShopToken;