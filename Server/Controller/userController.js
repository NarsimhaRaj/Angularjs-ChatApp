const UserServices=require('../Services/userServices');


//new user validation 
exports.userValidation = (req, res) => {
    req.checkBody('username','Invalid Username').isString().trim().isLength({min : 2});
    req.checkBody('email','Invalid Email').isEmail();
    //req.checkBody('password','password length must be 8').isLength({min : 8}).equals(req.body.confirmPassword);
    req.getValidationResult().then((errors)=>{
        if(!errors.isEmpty())
            res.status(404).send("not valid details");   
        else
            UserServices.registration(req,res);
    })
}

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