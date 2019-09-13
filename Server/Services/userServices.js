const User = require('../App/Model/userModel');
const token = require('../Middleware/token');
const mail = require('../Middleware/mail');
require('dotenv').config();

const bcrypt = require('bcrypt');
/**
 * @description : In login user will be verified first then his password will be checked, if all good loggin will be successfull
 * else sends response back to callback with a message     
 * @param {req}, req is request from client 
 * @param {callback}, callback is a function in which responses from server will be passed
 */
//exporting user valid details
exports.login = (req, callback) => {
    var username = req.body.username
    User.find({ username: username }).exec().then(user => {

        if (user.length < 1)
            callback("Entered wrong username")
        else {
            //comparing the password with hashed db password
            bcrypt.compare(req.body.password, user[0].password, function (err, result) {
                if (!result) { callback("Entered wrong Passwrod"); }
                if (result) {
                    //created a JWT Token based loggin
                    var tkn = token.generateToken({ username: user[0].username, id: user[0]._id }, process.env.KEY, { expiresIn: "1h" });
                    callback(null, tkn);
                }
            });

        }
    }).catch(err => callback(err));
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
            var tkn = token.generateToken({ email: req.body.email });

            mail.sendMail(req, tkn, (error, response) => {
                if (error)
                    callback("could not sent mail");
                else
                    callback(null, response);
            });

        }
    }).catch(error => callback("Invalid email " + error));

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

    var decode = token.verifyToken(req.body.token);
    if (decode.email) {
        bcrypt.hash(req.body.password, 5, function (err, hash) {
            if (err) callback("hashing error");
            else {
                User.findOneAndUpdate({ email: decode.email }, { $set: { password: hash } }, { new: true }).exec()
                    .then((user) => {
                        callback(null, user)
                    })

            }
        });
    }
    else
        callback("email not matched");

}