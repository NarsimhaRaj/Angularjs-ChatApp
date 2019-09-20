const express = require('express');
const router = express.Router();
const UserController = require('../Controller/userController');
const verify=require('../Middleware/token');
//login
router.post('/login',UserController.login);

//to create a new User
router.post('/register', UserController.register);


//forgot password
router.post('/forgotPassword',UserController.forgotPassword);


//resetting password
router.post('/resetPassword',verify.verifyToken,UserController.resetPassword);

//get all registered users
router.get('/getUsers',UserController.getUsers);


// router.post('/chatData',UserController.chatConversation);

module.exports = router;
