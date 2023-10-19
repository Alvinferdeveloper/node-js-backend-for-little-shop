const { 
    getStorage,
    ref, 
    getDownloadURL, 
    uploadBytes,
    deleteObject
    } = require('firebase/storage');
const fs = require('fs/promises');

const storage = getStorage();

const uploadPictureToCloud = async (picture,bucket)=>{
    const pictureSaved = await fs.readFile(picture.path);
    const fileName = `${bucket}/${picture.originalname}${new Date().getTime()}`
    const storageRef= ref(storage,fileName);
    const uploadedPicture = await uploadBytes(storageRef,pictureSaved,{contentType:picture.mimetype});
    await fs.unlink(picture.path);
    const urlOfPicuture = await getDownloadURL(uploadedPicture.ref);
    return Promise.resolve({urlOfPicuture,fileName});
}

const deletePictureFromCloud = async (fileRoute) => {
  const desertRef = ref(storage,fileRoute);
  return await deleteObject(desertRef);
                
}

module.exports = {
    uploadPictureToCloud,
    deletePictureFromCloud,
};