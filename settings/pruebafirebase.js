const {getStorage,ref, getDownloadURL, uploadBytes} = require('firebase/storage');
const fs=require('fs/promises');

const storage = getStorage();

const subir = async (file)=>{
    const img= await fs.readFile(file.path);
    const storageRef= ref(storage,`tienda/${file.originalname}${new Date()}`);
    const upload = await uploadBytes(storageRef,img,{contentType:file.mimetype});
    await fs.unlink(file.path);
    return getDownloadURL(upload.ref);
   }

module.exports = subir;