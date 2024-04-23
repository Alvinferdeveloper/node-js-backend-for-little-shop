const express = require('express');
const router = express.Router();
const {
    addProduct,
    getProduct,
    uploadProductPictures,
    getAllProducts,
    getProductsByCategory,
    deleteProduct,
    deletePictures,
    getImagesOfShop
    } = require('../controllers/productController');
const verifyShopToken = require('../middlewares/verifyShopToken');
const verifyUserToken = require('../middlewares/verifyUserToken');
const multer = require('../middlewares/multer');


router.post("/addProduct/:id",addProduct);
router.get('/getProduct/:id',getProduct);
router.post('/uploadProductPictures/:idProduct',[multer.array("picture",5)],uploadProductPictures);
router.get('/getAllProducts',getAllProducts);
router.get('/getproductsByCategory/:category',getProductsByCategory);
router.delete('/deleteProduct/:id',verifyShopToken,deleteProduct);
router.delete('/deletePictures',deletePictures);
router.get('/getProductImagesOfShop/:id',getImagesOfShop);

module.exports = router;