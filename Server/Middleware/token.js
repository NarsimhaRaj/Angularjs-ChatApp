const jwt = require('jsonwebtoken');
require('dotenv').config();
/**
 * @description: verifies a token and sends true or false 
 * @param {token}, a token 
 */
exports.verifyToken = (token) => {
    return jwt.verify(token, process.env.KEY);
}

/**
 * @description : generates a token for given data 
 * @param {data}, data is a object, has user email and id 
 */
exports.generateToken = (data) => {
    return jwt.sign(data, process.env.KEY, { expiresIn: "1h" });
}