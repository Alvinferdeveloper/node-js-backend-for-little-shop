const express = require('express');
const router = express.Router();
const {addShop,getShop}= require('../controllers/shopController');

router.post('/addshop',addShop);
router.get('/getShop/:id',getShop)

module.exports = router;