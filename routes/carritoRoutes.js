const express= require('express');
const router =  express.Router();
const { addToCart } = require('../controllers/carritoController');

router.post('/addToCart',addToCart);

module.exports = router;