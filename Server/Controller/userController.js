exports.userValidation = (req, res, callback) => {

    req.checkBody(req.body.username,"user invalid").isString().isLength({ min: 2 });

    var error = req.validationResult();
    if (error)
        res.status(404).send("error");
    else
        res.status(200).send("working fine");

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
}