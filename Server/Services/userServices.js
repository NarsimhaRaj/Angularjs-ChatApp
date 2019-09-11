const User = require('../App/Model/userModel');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
//exporting user valid details
exports.login = (req, res) => {
    var username = req.body.username
    User.find({ username: username })
        .exec()
        .then(user => {
            if (user.length < 1)
                res.status(404).send("Entered wrong username")
            else {
                //comparing the password with hashed db password
                var password = req.body.password;
                bcrypt.compare(password, user[0].password, function (err, result) {
                    if (err)
                        res.status(404).send("Entered wrong password ");
                    if (result) {
                        //created a JWT Token based loggin
                        var token = jwt.sign(
                            {
                                username: req.params.username,
                            }, "sdfdsfd", { expiresIn: "1h" }
                        );
                        res.header("autherization", token).send(token);
                        //res.status(200).json({token : token});
                        res.send(req.user);
                    }
                });

            }
        })
        .catch(err => {
            console.log("error has occured " + err);
            if (err) res.status(404).json({ message: "no user found" + err })
        });
        
}
exports.registration = (req, res) => {
    //encrypting password with hash function
    bcrypt.hash(req.body.password, 5, function (err, hash) {
        if (err)
            res.status(409).send("Error occured in hashing");
        else {
            var user = new User({
                username: req.body.username,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hash
            });
            user.save().then(user =>
                res.status(200).json({
                    message: "all the details has been recovered",
                    users: user
                })).catch(err => {
                    res.status(400).json({
                        message: "error has occured"
                    });
                });
        }
    });

}


// exports.forgotPassword=(req,res)=>{
//     var username =req.body.username;
//     User.findOne({username : username}).exec().then(user=>{

//     }).catch(err=> res.status(404).send("No such user exist"));
// }