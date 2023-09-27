const express = require('express');
const cors = require('cors');
require('./connection/mongooseConnection')
const fs = require('fs/promises');
const multer = require('multer');
const {getStorage,ref, getDownloadURL, uploadBytes, deleteObject} = require('firebase/storage');
require('./connection/firebaseConnection')
require('dotenv').config();
const upload = require("./middlewares/multer")
const subir = require("./settings/pruebafirebase");
const userRoutes = require('./routes/userRoutes');
const shopRoutes = require('./routes/shopRoutes');
const productRoutes = require('./routes/productRoutes')


const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/',userRoutes);
app.use('/',shopRoutes)
app.use('/',productRoutes);

/*
app.post('/img',upload.single('imagen'),subir);

app.get('/delete',async(req,res)=>{
  const desertRef= ref(storage,"tienda/Investigacion.jpg1695611731786");
  await deleteObject(desertRef).catch(err=>console.log(err));
  res.json({success:"todo bien"});
})



app.post('/',(req,res)=>{
  console.log(res.files)
  res.json(req.files.imagen)
})
*/

app.listen(process.env.PORT, ()=>console.log('listening on port '+process.env.PORT));

