const multer = require('multer');

const storages = multer.diskStorage({
    destination: function (req, file, cb) {
      // Especifica la carpeta donde se guardarán los archivos subidos
      cb(null, './imgs');
    },filename: function (req, file, cb) {
      // Define el nombre del archivo en el servidor (puedes personalizarlo según tus necesidades)
      cb(null, file.originalname);
    },
  });
  
  module.exports= multer({ storage:storages});