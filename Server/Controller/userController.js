const UserServices = require('../Services/userServices');

//login 
/**
 * @description : here we check for username and password validation if no error comes then we'll check user credentials in database     
 * @param {req}, req is request from client 
 * @param {callback}, callback is a function in which responses from server will be passed
 */
exports.login = (req, res) => {
    var response = {}
    req.checkBody('email', 'Invalid Username').isEmail();
    req.checkBody('password', 'Invalid password').isLength({ min: 8 });

    req.getValidationResult().then((err) => {
        if (!err.isEmpty()) {
            response.error = "Enterd details are not in correct format ";
            res.status(422).send(response);
        }
        else {
            UserServices.login(req.body, (err, result) => {
                if (err) {
                    response.error = err;
                    response.status = false;
                    res.status(404).send(response);
                }
                else {
                    response.data = result;
                    response.message = "successfully logged in";
                    response.status = true;
                    res.status(200).send(response);
                }
            })
        }
    }).catch(err => res.status(500).send({ error: "Error occured in getting validation result", status: false }));
}
//new user validation 
/**
 * @description : in this function we validate user details like username,firstname,lastname,email,password as required 
 * if it's valid then we'll store the details into database from another login function in Userservices.
 * @param {req}, req is request from client 
 * @param {callback}, callback is a function in which responses from server will be passed
 */
exports.register = (req, res) => {
    var response = {}

    req.checkBody('username', 'Invalid Username').isString().trim().isLength({ min: 2 });
    req.checkBody('email', 'Invalid Email').isEmail();
    req.checkBody('firstname', 'Invalid').isString().trim().isLength({ min: 2 });
    req.checkBody('lastname', 'Invalid').isString().trim().isLength({ min: 2 });
    req.checkBody('password', 'password length must be 8').isLength({ min: 8 }).equals(req.body.confirmPassword);

    req.getValidationResult().then((errors) => {
        if (!errors.isEmpty()) {
            response.error = "Enterd details are not in correct format ";
            res.status(422).send(response);
        }
        else {

            UserServices.registration(req.body, (err, data) => {
                if (err) {
                    response.error = err;
                    response.status = false;
                    res.status(404).send(response);
                }
                else {
                    response.data = data;
                    response.message = "Registerd successfully";
                    response.status = true;
                    res.status(200).send(response);
                }
            });
        }
    }).catch(err => res.status(500).send({ error: "Error occured in getting validation result", status: false }))
}
//forgot Password 
/**
 * @description : we check for the email validation, if it's valid then we'll check whether email existed or not. if exist
 * we'll send mail to user for resetting password 
 * @param {req}, req is request from user 
 * @param {callback}, callback is a function in which responses from server will be passed
 */
exports.forgotPassword = (req, res) => {

    var response = {}
    req.checkBody('email', 'Invalid Email').isEmail();
    req.getValidationResult().then((err) => {
        if (!err.isEmpty()) {
            response.error = "invalid email";
            response.status = false;
            res.status(422).send(response)
        }
        else {
            //forgot password
            UserServices.forgotPassword(req.body, (err, data) => {
                if (err) {
                    response.error = err;
                    response.status = false;
                    res.status(404).send(response);
                }
                else {
                    response.data = data;
                    response.status = true;
                    response.message = "reset Password link has sent to your registeredMail"
                    res.status(200).send(response);
                }
            });
        }
    }).catch(err => res.status(500).send({ error: "Error occured in getting validation result", status: false }));
}
//reseting password
/**
 * @description : validate the password only if length is minimum 8 and conifrm password matches, if no errors calls resetpassword
 * function in Userservices and finds user data in database and updates password  
 * @param {req}, req is request from client 
 * @param {callback}, callback is a function in which responses from server will be passed
 */
exports.resetPassword = (req, res) => {

    var response = {};

    req.checkBody('password', "password length must be 8").isLength({ min: 8 }).equals(req.body.confirmPassword);
    req.getValidationResult().then((err) => {
        if (!err.isEmpty()) {
            response.error = "password and confirm password not matching";
            response.status = false;
            res.status(422).send(response)
        }
        else {
            console.log("hello " + req.decode.email)
            UserServices.resetPassword(req, (err, result) => {
                if (err) {
                    response.status = false;
                    response.error = "can not reset password due to some technical error, we are working on it";
                    res.status(404).send(response);
                }
                else {
                    response.status = true;
                    response.message = "Password has been changed "
                    response.data = result.email;
                    res.status(200).send(response);
                }
            });
        }
    }).catch(err => res.status(500).send({ error: "Password not as required ", status: false }));
}

//to get all registered users data
exports.getUsers = (req, res) => {
    var response = {}
    UserServices.getUsers(req, (err, users) => {
        if (err) {

            response.error = err;
            response.status = false;
            res.status(422).send(response);
        }
        else {
            response.status = true;
            response.data = users;
            res.status(200).send(response)
        };
    });
}

/**
 * @description : passes chatData to chatConversation function in Userservices, if the converation exist then returns with 
 * data otherwise returns error
 * @param {chatData}, it's a object contains sender, receiver and message 
 */
exports.chatConversation = (chatData,callback) => {

    var response={};
    UserServices.chatConversation(chatData, (err, data) => {
        if (err) {
            response.error = "Some error occured ";
            response.status = false;
            callback(response)
        }
        else {
            response.data = data;
            response.status = true;
            //res.send(response);
            // return response;
            callback(null,response)
        }

    })
}
/**
 * @description: fetches conversation if sender and receiver conversation exist, if not send a error message.
 * request body holds sender and receiver emails
 */
exports.fetchConversation=(req,res)=>{
    var response={}
    UserServices.fetchConversation(req.body,(err,data)=>{
        if (err) {
            response.error = [{message:err}];
            response.status = false;
            //res.send(response);
            res.status(404).send(response);
        }
        else {
            response.data = data;
            response.status = true;
            //res.send(response);
            // return response;
            
            res.status(200).send(response);
        }
    });
}