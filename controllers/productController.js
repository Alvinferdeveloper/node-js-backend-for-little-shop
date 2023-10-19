const validator = require('validator');
const Product = require('../models/product');
const product = require('../models/product');
const shop = require('../models/shop');
const productPicture = require('../models/productPicture');
const { uploadPictureToCloud, deletePictureFromCloud } = require('../services/firebaseActions');

const addProduct = (req,res)=>{
    const {name,price,availables} = req.body;
    const {id:id_shop} = req.shop;
    if(!name || !price || !availables){
        return res.status(403).json({
            status:"error",
            message:"informacion necesaria incompleta",
        })
    }

    const priceIsaNumber = !isNaN(price);
    const availablesIsaNumber = !isNaN(availables);
    const nameIsValid = validator.isLength(name,{min:3,max:undefined});
    if(!priceIsaNumber || !availablesIsaNumber || !nameIsValid){
        return res.status(403).json({
            status:"error",
            message:"Alguna informacion no esta en el formato correcto"
        })
    }

    const productToAdd = {
       ...req.body,
        id_shop
    }

    const product = new Product(productToAdd);
    product.save().then((prod)=>{
        res.status(200).json({
            status:"sucess",
            prod,
        })
    }).catch(()=>{
        res.status(403).json({
            status:"error",
            message:"No se pudo agregarer el producto"
        })
    })
};


const getProduct = async (req,res) =>{
    const { id } = req.params;
    let product;
    let pictures;
    try {
        product = await Product.findById(id);
        pictures = await productPicture.find({id_product:id});
        if(!product){
            return res.status(404).json({
                status:"error",
                message:"No se pudo encontrar el producto"
            });
        }
    }
    catch{
        return res.status(404).json({
            status:"error",
            message:"error al encontrar el producto"
        });
    }

    return res.status(200).json({
        status:"success",
        product,
        pictures
    });
}

const uploadProductPictures = async (req,res) => {
    const { files } = req;
    const { idProduct } = req.params;
    const BUCKET = "product";
    const MAX_OF_PICTURES = 5;
    const picturesUploaded = [];
    let missing = 0;
    
    if(!files)
    return res.status(403).json({status:"error",message:"no se proporcionaron imagenes"});

    try {
        let picturesForThisProduct = await productPicture.find({id_product:idProduct});
        let counterOfPicturesSavedOnDb = picturesForThisProduct.length;
        for (let picture of files){
                if(counterOfPicturesSavedOnDb <= MAX_OF_PICTURES) {
                    const {urlOfPicuture, fileName} = await uploadPictureToCloud(picture,BUCKET);
                    const pictureToSave = new productPicture({
                        url: urlOfPicuture,
                        firebaseName:fileName,
                        id_product:idProduct,
                    });
                    const pictureUploaded = await pictureToSave.save();
                    picturesUploaded.push(pictureUploaded)
                    counterOfPicturesSavedOnDb++;
                }
                else {
                    missing++;
                }
            
        }

        if(missing!=0)
        return res.status(403).json({
            status:"error",
            message:"Ya no se pueden agregar mas fotos a este producto"
        })

        return res.status(200).json({
            status:"success",
            message:"pictures uploaded successfully",
            picturesUploaded,
            missing
        })
    }
    catch(err){
        console.log(err)
        res.status(404).json({
            status: 'error',
            message: 'product not found'
        })
    }
}

const getAllProducts = async (req,res) => {
    const productsWithPictures = [];
    try{
        const products = await Product.find({});
        for(let product of products){
            const pictures = await productPicture.find({id_product:product.id});
            productsWithPictures.push({
                product,
                pictures,
            });
           
        }
       
       
        return res.status(200).json({
            status:"success",
            products:productsWithPictures,
        });
    }
    catch{
        return res.status(404).json({
            status: 'error',
            message:"Products not found"
        });
    }
}

const getProductsFromCity = async (req,res) => {
    const { city } = req.params;
    const productWithPictures = [];
    try {
        const shops = await shop.find({city: city},"id");
        const idList = shops.map(idObject => idObject.id);
        const products = await Product.find({id_shop:{$in: idList}});
        for(let product of products){
            const pictures = await productPicture.find({id_product:product.id});
            productWithPictures.push({
                product,
                pictures,
            })
        }
        return res.status(200).json({ 
            statusbar: 'success',
            products:productWithPictures,
        })
    }
    catch(err) {
        res.status(500).json({
            status: 'error',
            message:"ocurrio un error al procesar la solicitud"
        })
    }

}


const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const { id:idShop} = req.shop;
    console.log(id,idShop)
    try {
        const productDeleted = await product.deleteOne({$and:[{_id:id},{id_shop:idShop}]});
        if(productDeleted.deletedCount == 1){
            const pictures = await productPicture.find({id_product:id});
            await productPicture.deleteMany({id_product:id});
            pictures?.forEach(async picture => {
                await deletePictureFromCloud(picture.firebaseName);
            })
        res.status(200).json({
            status: 'success',
            message: "Product deleted"
        });
    }

        else
        res.status(404).json({
            status: 'error',
            message: 'Product not found'
        });
    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            status: 'error',
            message:'error deleting product',
            err
        });
    }
}

const deletePictures = async  (req, res) => {
    const { id_pictures:picturesToDelete} =  req.body;
    try {
        const productsPicturesToDelete = await productPicture.find({_id:{$in:picturesToDelete}});
        await productPicture.deleteMany({_id:{$in:productsPicturesToDelete}});
        productsPicturesToDelete.forEach(async picture => {
            await deletePictureFromCloud(picture.firebaseName);
        })
        
        return res.status(200).json({status: 'success',message: 'Products deleted'});
    }
    catch{
        res.status(500).json({status: 'error',message: 'Error deleting'});
    }                             
}



module.exports = {
    addProduct,
    getProduct,
    uploadProductPictures,
    getAllProducts,
    getProductsFromCity,
    deleteProduct,
    deletePictures,
};