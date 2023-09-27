const express = require('express');
const router = express.Router();
const {addProduct,getProduct} = require('../controllers/productController');
const verifyShopToken = require('../middlewares/verifyShopToken');

router.post("/addProduct",verifyShopToken,addProduct);
router.get('/getProduct/:id',getProduct);

module.exports = router;