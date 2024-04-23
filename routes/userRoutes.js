const express = require('express');
const router = express.Router();
const {addUser,updateProfile,getUser,userLogIn} = require('../controllers/userControllers');
const multer = require('../middlewares/multer');
const verifyUserToken = require('../middlewares/verifyUserToken');

router.post('/addUser',addUser);
router.put('/updateProfile',[multer.single("profile"),verifyUserToken],updateProfile);
router.get("/getUser",verifyUserToken,getUser);
router.post('/userlogin',userLogIn);

module.exports = router;