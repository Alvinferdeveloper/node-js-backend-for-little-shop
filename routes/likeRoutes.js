const express = require('express');
const router = express.Router();
const addLike = require('../controllers/likescontroller');

router.post('/addLike',addLike);

module.exports = router;