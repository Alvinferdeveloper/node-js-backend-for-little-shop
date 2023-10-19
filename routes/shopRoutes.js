const express = require('express');
const router = express.Router();
const {addShop,getShopById,getShop,shopLogin,uploadShopPictures}= require('../controllers/shopController');
const verifyShopToken = require('../middlewares/verifyShopToken');
const multer = require('../middlewares/multer')

router.post('/addshop',addShop);
router.get('/getShop/:id',getShopById);
router.get('/getShop',verifyShopToken,getShop);
router.post('/shopLogin',shopLogin);
router.post('/uploadShopPictures',[verifyShopToken,multer.array("picture",10)],uploadShopPictures);

module.exports = router;

/*eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY1MmRmNjc3NDBmMjViMTQxZDJhYmI1NCIsInBob25lIjoiNzc3NzQ0MjEiLCJuYW1lIjoicGl4YXIgMiIsImRlcGFydGFtZW50byI6Imxlb24iLCJtdW5pY2lwaW8iOiJsZW9uIiwiY2l0eSI6Imxlb24iLCJleGFjdERpcmVjY2lvbiI6ImNhc2EgbiA1Iiwicm9sIjoic2hvcCIsImlhdCI6MTY5NzUxMTAzMSwiZXhwIjoxNzAwMTAzMDMxfQ.Dq2V0PnKOeksSKW62yuLpK2Rb3kt51Tj3oPcMexuwmI*/