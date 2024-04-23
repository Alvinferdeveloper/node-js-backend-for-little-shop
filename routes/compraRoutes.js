const express = require('express');
const router = express.Router();
const {addCompra} = require('../controllers/compraController')

router.post('/addcompra',addCompra);

module.exports = router;