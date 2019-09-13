const express = require('express');
const router = express.Router();
const UserController = require('../Controller/userController');

//login
router.post('/login',UserController.login);

//to create a new User
router.post('/register', UserController.register);


//forgot password
router.post('/forgotPassword',UserController.forgotPassword);


//resetting password
router.post('/resetPassword',UserController.resetPassword);


module.exports = router;
