const UserServices = require('../Services/userServices');

//login 
exports.login = (req, res) => {
    var response = {
        data: null,
        status: false
    }
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
exports.register = (req, res) => {
    var response = {
        data: null,
        status: false
    }
    req.checkBody('username', 'Invalid Username').isString().trim().isLength({ min: 2 });
    req.checkBody('email', 'Invalid Email').isEmail();
    //req.checkBody('password','password length must be 8').isLength({min : 8}).equals(req.body.confirmPassword);
    req.getValidationResult().then((errors) => {
        if (!errors.isEmpty()) {
            response.message = "Enterd details are not in correct format ";
            res.send(response);
        }
        else {
            UserServices.registration(req, res, (err, data) => {
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
// exports.verifyToken = function (req, res) {
//     const token = req.header('autherization');
//     if (!token) res.status(404).send("token failed");
//     jwt.verify(token, "sdfdsfd", function (err, decode) {
//         if (err) res.status(404).send("verifcation failed");
//         else req.user = decode;
//     });

// }
exports.forgotPassword = (req, res) => {
    
    var response = {
        data : null,
        status:false
    }
    req.checkBody('email', 'Invalid Email').isEmail();
    req.getValidationResult().then((err) => {
        if (!err.isEmpty()) {
            response.message = "invalid email";
            res.send(response)
        }
        else {
            
            UserServices.forgotPassword(req,(err,data)=>{
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
    }).catch(err=>{res.send(err)});
}

exports.resetPassword=(req,res)=>{
    console.log("hello");
    var response={data:null,status:false,message:""};
    UserServices.resetPassword(req,(err,result)=>{
        if(err)
        {
            response.message="error occured in restting password"
            res.status(404).send(response);
        }
        else
        {
            response.status=true;
            response.message="Password has been changed "
            response.data=result;
            res.status(404).send(response);
        }
    });
}