const User = require('../App/Model/userModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const bcrypt = require('bcrypt');
require('dotenv').config();
//exporting user valid details
exports.login = (req, callback) => {
    var username = req.body.username
    User.find({ username: username })
        .exec()
        .then(user => {
            if (user.length < 1)
                callback("Entered wrong username")
            else {
                //comparing the password with hashed db password
                var password = req.body.password;
                bcrypt.compare(password, user[0].password, function (err, result) {
                    if (!result) { callback("Entered wrong Passwrod"); }
                    if (result) {
                        //created a JWT Token based loggin
                        var token = jwt.sign({ username: user[0].username }, process.env.KEY, { expiresIn: "10d" });
                        callback(null, token);
                    }
                });

            }
        })
        .catch(err => {
            callback(err);
        });
}
exports.registration = (req, res, callback) => {
    //encrypting password with hash function
    bcrypt.hash(req.body.password, 5, function (err, hash) {
        if (err)
            callback("Error occured in hashing");
        else {
            var user = new User({
                username: req.body.username,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hash
            });
            user.save().then(user => callback(null, user)).catch(err => callback(err));
        }
    });

}

exports.forgotPassword = (req, callback) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.PASSWORD // generated ethereal password
        },
        tls: { rejectUnauthorized: false }
    });
    // Message object
    var token = jwt.sign({ username: req.body.email }, process.env.KEY, { expiresIn: "1h" });

    var message = {

        // sender info
        from: process.env.EMAIL,

        // Comma separated list of recipients
        to: req.body.email,
        subject: 'Reset Password for your Chat App', // Subject line
        text: 'Click on the following link to reset password \n' + "http://localhost:3000/resetPassword/" + token, // plain text body
        html: '' // html body
    };

    transporter.sendMail(message, function (error, response) {
        if (error) {
            callback(error);
            return;
        }
        callback(response);
    });
};

exports.resetPassword = (req, callback) => {
    jwt.verify(req.body.token, process.env.KEY, function (err, decode) {
        if (err) callback("verifcation failed");
        else {
            bcrypt.hash(req.body.password,5,function(err,hash){
                if(err) callback(err);
                else
                {
                    User.findOneAndUpdate({email:decode.email},{$set : { password : hash}},{new:true})
                    .then(user=>callback(user)).catch(error=>callback(error));
                }
            })
            
        }
    });
}