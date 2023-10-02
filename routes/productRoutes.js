const express = require('express');
const router = express.Router();
const {addProduct,getProduct,uploadProductPictures} = require('../controllers/productController');
const verifyShopToken = require('../middlewares/verifyShopToken');
const multer = require('../middlewares/multer');

router.post("/addProduct",verifyShopToken,addProduct);
router.get('/getProduct/:id',getProduct);
router.post('/uploadProductPictures/:idProduct',[verifyShopToken,multer.array("picture",5)],uploadProductPictures);

module.exports = router;