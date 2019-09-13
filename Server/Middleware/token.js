const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyToken = (token) => {
    return jwt.verify(token, process.env.KEY);
}


exports.generateToken = (data) => {
    return jwt.sign(data, process.env.KEY, { expiresIn: "1h" });
}