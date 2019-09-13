const User = require('../App/Model/userModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const bcrypt = require('bcrypt');
require('dotenv').config();

/**
 * @description : In login user will be verified first then his password will be checked, if all good loggin will be successfull
 * else sends response back to callback with a message     
 * @param {req}, req is request from client 
 * @param {callback}, callback is a function in which responses from server will be passed
 */
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
/**
 * @description : user registration details will be stored to mongodb database, email and username in mongoose schema 
 * has property called unique which set to true, means no other user will have same email or username    
 * @param {req}, req is request from client 
 * @param {callback}, callback is a function in which responses from server will be passed
 */
exports.registration = (req, callback) => {
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
/**
 * @description : Once the user is verified as existing client then an email with a link and token will be sent  
 * @param {req}, req is request from client 
 * @param {callback}, callback is a function in which responses from server will be passed
 */
exports.forgotPassword = (req, callback) => {
    User.find({ email: req.body.email }).exec().then(user => {
        if (user.length < 1) callback("user not found");
        else {
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com', port: 465,
                secure: true, 
                auth: {
                    user: process.env.EMAIL, // generated ethereal user
                    pass: process.env.PASSWORD // generated ethereal password
                },
                tls: { rejectUnauthorized: false }
            });
            var token = jwt.sign({ email: "ramarao232323@gmail.com" }, process.env.KEY, { expiresIn: "1h" });

            var message = {
                from: process.env.EMAIL,
                to: req.body.email,
                subject: 'Reset Password for your Chat App', // Subject line
                text: 'Click on the following link to reset password \n' + "http://localhost:3000/resetPassword/" + "\n" + token, // plain text body
                html: '' // html body
            };

            transporter.sendMail(message, function (error, response) {
                if (error) callback(error);
                else callback(response);
            });
        }
    }).catch(error => callback("Invalid email"));

};
// var createTransport=()=>{

// }
//resetting the password 
/**
 * @description : first verfying the token which was sent to user from narsimhacodepractice@gmail.com, once its verified 
 * decoded mail will be searched in the database if email exists in db then replaces the password with new password 
 * @param {req}, req is request from client 
 * @param {callback}, callback is a function in which responses from server will be passed
 */
exports.resetPassword = (req, callback) => {
    jwt.verify(req.body.token, process.env.KEY, function (err, decode) {
        if (err) callback("verifcation failed");
        else {
            bcrypt.hash(req.body.password, 5, function (err, hash) {
                if (err) callback("hashing error");
                else {
                    User.findOneAndUpdate({ email: decode.email }, { $set: { password: hash } }, { new: true }).exec()
                        .then((user) => {
                            callback(null, user)
                        })
                        .catch((error) => callback("email not matched"));
                }
            })

        }
    });
}