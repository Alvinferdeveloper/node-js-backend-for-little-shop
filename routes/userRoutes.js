const express = require('express');
const router = express.Router();
const {addUser,uploadProfile,getUser,userLogIn} = require('../controllers/userControllers');
const multer = require('../middlewares/multer');
const verifyUserToken = require('../middlewares/verifyUserToken');

router.post('/addUser',addUser);
router.post('/uploadProfile',[multer.single("profile"),verifyUserToken],uploadProfile);
router.get("/getUser",verifyUserToken,getUser);
router.get('/userlogin',userLogIn);

module.exports = router;