const jwt = require('jsonwebtoken');
require('dotenv').config();
/**
 * @description: verifies a token and sends true or false 
 * @param {token}, a token 
 */
exports.verifyToken = (req,res,next) => {
    var token=req.header("authentication");
    //console.log(token)
    // var token =req.params.token;
    if(!token){
        return res.status(404).send({error:"Invalid Link",status:false});
        
    }try{
        req.decode=jwt.verify(token,process.env.KEY);
        next();
    }
    catch(err){
    
        res.status(404).send({error:"Invalid Autherization",status:false});
    }
}

/**
 * @description : generates a token for given data 
 * @param {data}, data is a object, has user email and id 
 */
exports.generateToken = (data) => {
    return jwt.sign(data, process.env.KEY, { expiresIn: "1h" });
}