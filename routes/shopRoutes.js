const express = require('express');
const router = express.Router();
const addShop= require('../controllers/shopController');

router.post('/shopLogin',addShop);

module.exports = router;