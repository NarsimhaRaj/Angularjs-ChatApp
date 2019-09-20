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
exports.login = (body, callback) => {
    var username = body.username
    User.find({ username: username }).exec().then(user => {

        if (user.length < 1)
            callback("Entered wrong username")
        else {
            //comparing the password with hashed db password
            bcrypt.compare(body.password, user[0].password, function (err, result) {
                if (!result) { callback("Entered wrong Passwrod"); }
                if (result) {
                    //generates a token on loggin
                    var tkn = token.generateToken({ username: user[0].username, id: user[0]._id });
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
exports.registration = (body, callback) => {
    //encrypting password with hash function
    var user = {
        username: body.username,
        firstname: body.firstname,
        lastname: body.lastname,
        email: body.email,
        password: bcrypt.hashSync(body.password, 5),
        joined : new Date().toUTCString(),
        updated : new Date().toUTCString()
    };
    var newUser = new User(user);
    newUser.save().then(user => callback(null, user)).catch(err => callback(err));

}
/**
 * @description : Once the user is verified as existing client then an email with a link and token will be sent  
 * @param {req}, req is request from client 
 * @param {callback}, callback is a function in which responses from server will be passed
 */
exports.forgotPassword = (body, callback) => {
    User.find({ email: body.email }).exec().then(user => {
        if (user.length < 1) callback("entered email is not found");
        else {
            var tkn = token.generateToken({ email: body.email });

            mail.sendMail(body, tkn, (error, response) => {
                if (error)
                    callback("could not sent mail, due to some technical error ");
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
    console.log(req.decode.email);
    if (req.decode.email) {
        bcrypt.hash(req.body.password, 5, function (err, hashedPassword) {
            if (err) callback("hashing error");
            else {
                User.findOneAndUpdate({ email: req.decode.email }, { $set: { password: hashedPassword,updated: (new Date()).toUTCString() } }, { new: true }).exec()
                    .then((user) => {
                        callback(null, user)
                    })

            }
        });
    }
    else
        callback("email not matched");

}
/**
 * @description : finds all records in database and sends responce using callback to user Controllers
 * @param {req}, req is request from user 
 * @param {callback}, callback is a function 
 */
exports.getUsers = (req, callback) => {
    User.find().exec()
        .then(users => {
            if (users.length < 1)
                callback("no registered students");
            else{
                callback(null, users)
            }
        }).catch(err => callback("unable to get data error is :" + err));
}