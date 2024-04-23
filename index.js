const express = require('express');
const cors = require('cors');
require('./connection/mongooseConnection')
require('./connection/firebaseConnection')
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const shopRoutes = require('./routes/shopRoutes');
const productRoutes = require('./routes/productRoutes');
const likesRoutes = require('./routes/likeRoutes');
const cartRoutes = require('./routes/carritoRoutes');
const compraRoutes = require('./routes/compraRoutes');


const app = express();
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use('/',userRoutes);
app.use('/',shopRoutes)
app.use('/',productRoutes);
app.use('/',likesRoutes);
app.use('/',cartRoutes);
app.use('/',compraRoutes);




//app.post('/img',upload.single('imagen'),subir);
/*
app.delete('/delete',async(req,res)=>{
  const storage = getStorage();
  const desertRef= ref(storage,"product/UNAN_LeÃ³n.jpg1697345431268");
  await deleteObject(desertRef)
                .then(()=>res.json({message:"delete succesfully"}))
                .catch(()=>res.json({message:"not able to delete"}))
})
*/

console.log(`user/imagen${new Date().getTime()}`);
app.listen(process.env.PORT, ()=>console.log('listening on port '+process.env.PORT));
