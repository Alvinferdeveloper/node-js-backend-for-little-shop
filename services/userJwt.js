const moment = require('moment');
const jwt = require('jwt-simple');

const generateUserToken = (user)=>{
    const payload ={
        id:user._id,
        phone:user.phone,
        name:user.name,
        lastname:user.lastname,
        profilePicture:user.profilePicture,
        rol:user.rol,
        iat:moment().unix(),
        exp:moment().add(30,"days").unix(),
    }

    return jwt.encode(payload,process.env.SECRET);
}

module.exports = generateUserToken;