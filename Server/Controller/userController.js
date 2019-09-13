const UserServices = require('../Services/userServices');

//login 
/**
 * @description : here we check for username and password validation if no error comes then we'll check user credentials in database     
 * @param {req}, req is request from client 
 * @param {callback}, callback is a function in which responses from server will be passed
 */
exports.login = (req, res) => {
    var response = {}
    req.checkBody('username', 'Invalid Username').isString().trim().isLength({ min: 2 });
    req.checkBody('password', 'Invalid password').isLength({ min: 8 });

    req.getValidationResult().then((err) => {
        if (!err.isEmpty()) {
            response.message = "Enterd details are not in correct format ";
            res.send(response);
        }
        else {
            UserServices.login(req, (err, result) => {
                if (err) {
                    response.message = err;
                    res.send(response);
                }
                else {
                    response.data = result;
                    response.message = "successfully logged in";
                    response.status = true;
                    res.send(response);
                }
            })
        }
    });
}
//new user validation 
/**
 * @description : in this function we validate user details like username,firstname,lastname,email,password as required 
 * if it's valid then we'll store the details into database from another login function in Userservices.
 * @param {req}, req is request from client 
 * @param {callback}, callback is a function in which responses from server will be passed
 */
exports.register = (req, res) => {
    var response = {}// data: null, status: false }

    req.checkBody('username', 'Invalid Username').isString().trim().isLength({ min: 2 });
    req.checkBody('email', 'Invalid Email').isEmail();
    req.checkBody('firstname', 'Invalid').isString().trim().isLength({ min: 2 });
    req.checkBody('lastname', 'Invalid').isString().trim().isLength({ min: 2 });
    req.checkBody('password', 'password length must be 8').isLength({ min: 8 }).equals(req.body.confirmPassword);

    req.getValidationResult().then((errors) => {
        if (!errors.isEmpty()) {
            response.message = "Enterd details are not in correct format ";
            res.send(response);
        }
        else {
            UserServices.registration(req, (err, data) => {
                if (err) {
                    response.message = err;
                    res.send(response);
                }
                else {
                    response.data = data;
                    response.message = "Registerd successfully";
                    response.status = true;
                    res.send(response);
                }
            });
        }
    })
}
//forgot Password 
/**
 * @description : we check for the email validation, if it's valid then we'll check whether email existed or not. if exist
 * we'll send mail to user for resetting password 
 * @param {req}, req is request from user 
 * @param {callback}, callback is a function in which responses from server will be passed
 */
exports.forgotPassword = (req, res) => {

    var response = {}//data: null, status: false }
    req.checkBody('email', 'Invalid Email').isEmail();
    req.getValidationResult().then((err) => {
        if (!err.isEmpty()) {
            response.message = "invalid email";
            res.send(response)
        }
        else {
            //forgot password
            UserServices.forgotPassword(req, (err, data) => {
                if (err) {
                    response.message = err;
                    res.send(response);
                }
                else {
                    response.data = data;
                    response.status = true;
                    res.send(response);
                }
            });
        }
    }).catch(err => { res.send(err) });
}
//reseting password
/**
 * @description : validate the password only if length is minimum 8 and conifrm password matches 
 * @param {req}, req is request from client 
 * @param {callback}, callback is a function in which responses from server will be passed
 */
exports.resetPassword = (req, res) => {

    var response ={};// { data: "", status: false, message: "" };

    req.checkBody('password', "password length must be 8").isLength({ min: 8 }).equals(req.body.confirmPassword);
    req.getValidationResult().then((err) => {
        if (!err.isEmpty()) {
            response.data = err; response.message = "password and confirm password not matching";
            res.send(response)
        }
        else {
            UserServices.resetPassword(req, (err, result) => {
                if (err) {
                    response.data = err;
                    response.message = "error occured in restting password ";
                    res.status(404).send(response);
                }
                else {
                    response.status = true;
                    response.message = "Password has been changed "
                    response.data = result.email;
                    res.status(404).send(response);
                }
            });
        }
    }).catch(err=>res.status(404).send("Password not as required "));
}