const express = require('express');
const router = express.Router();
const addProduct = require('../controllers/productController');
const verifyShopToken = require('../middlewares/verifyShopToken');

router.post("/addProduct",verifyShopToken,addProduct);

module.exports = router;