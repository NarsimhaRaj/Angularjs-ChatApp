const express = require('express');
const router = express.Router();
const User = require("../App/Model/userModel")
const UserController = require('../Controller/userController');

//login
router.post('/login',UserController.login);

//to create a new User
router.post('/register', UserController.register);



//forgot password
router.post('/forgot',UserController.forgotPassword);


//resetting password
router.patch('/resetPassword',UserController.resetPassword);
//(req,res) => UserServices.resetPassword(req,res));


module.exports = router;
