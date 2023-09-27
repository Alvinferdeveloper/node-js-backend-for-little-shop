const moment = require('moment');
const jwt = require('jwt-simple');

const generateShopToken = (shop)=>{
    const payload ={
        id:shop._id,
        phone:shop.phone,
        name:shop.name,
        departamento:shop.departamento,
        municipio:shop.municipio,
        city:shop.city,
        exactDireccion:shop.exactDirection,
        rol:shop.rol,
        iat:moment().unix(),
        exp:moment().add(30,"days").unix(),
    }

    return jwt.encode(payload,process.env.SECRET);
}

module.exports = generateShopToken;