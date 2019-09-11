const express = require('express');
const router = express.Router();
const User = require("../App/Model/userModel")
const UserServices = require('../Services/userServices');
const UserController = require('../Controller/userController');
//const verifyToken=require('../Router/verifyToken');
//login
router.post('/login', function (req, res, next) {
                    const token = req.header('autherization');
                    if (!token) res.sendStatus(403);
                    try {
                          const verified = jwt.verify(token, "sdfdsfd");
                          req.user = verified;

                        next();
                        }   catch (err) { res.status(404).send("sorry"); }
                        },
                         (req, res) => { UserServices.login(req, res) });

//get registered users
router.get('/register', function (req, res) {

    User.find(function (err, user) {
        if (err) res.status(404).json({ message: "nothing to show" });
        else
            res.status(200).json(user)
    });
});

//to create a new User
router.post('/register', (req, res) => UserController.userValidation(req, res));

//forgot password
// router.post('/forgot',(req,res)=>UserServices.forgotPassword(req,res));

// //resetting password
// router.put('/reset',(req,res)=> UserServices.resetPassword(req,res));
//}
//res.status(200).send("working fine");

//   req.checkbody('username','username invalid').isString();
/* const user = new User({
    username: req.check(req.body.username).,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email
})

res.status(200).json({
    message: "i have received these following details",
    users: user
})*/
//}userController.userValidation());

module.exports = router;
