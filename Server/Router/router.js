const express = require('express');
const router = express.Router();
const User = require("../App/Model/userModel")
const userController=require('../Controller/userController');
//const Person = require('../App/Model/userModel');
router.get('/', function (req, res, callback) {

});

router.post('/', userController.userValidation());

module.exports = router;
