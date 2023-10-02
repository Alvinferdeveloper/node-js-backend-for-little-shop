const express = require('express');
const router = express.Router();
const {addShop,getShopById,getShop,shopLogin,uploadShopPictures}= require('../controllers/shopController');
const verifyShopToken = require('../middlewares/verifyShopToken');
const multer = require('../middlewares/multer')

router.post('/addshop',addShop);
router.get('/getShop/:id',getShopById);
router.get('/getShop',verifyShopToken,getShop);
router.post('/shopLogin',shopLogin);
router.post('/uploadShopPictures',[verifyShopToken,multer.array("picture",10)],uploadShopPictures)

module.exports = router;