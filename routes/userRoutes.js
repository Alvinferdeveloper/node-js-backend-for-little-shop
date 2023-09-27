const express = require('express');
const router = express.Router();
const {addUser,uploadProfile} = require('../controllers/userControllers');
const multer = require('../middlewares/multer');
const verifyUserToken = require('../middlewares/verifyUserToken');

router.post('/userLogin',addUser);
router.post('/uploadProfile',[multer.single("profile"),verifyUserToken],uploadProfile);

module.exports = router;